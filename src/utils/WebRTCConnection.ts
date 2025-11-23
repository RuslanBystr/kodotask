import { EventEmitter } from 'eventemitter3';

import { socket } from '@/utils/socket';

export type CallState = 'idle' | 'calling' | 'incoming' | 'connected' | 'ended';

export interface WebRTCOptions {
  iceServers: RTCIceServer[];
  localStream?: MediaStream;
  chatId: string;
  toUserId: string;
  initiator?: boolean;
}

export interface RTCSignal {
  type: 'offer' | 'answer' | 'end' | 'candidate';
  sdp: RTCSessionDescriptionInit;
  candidate: RTCIceCandidateInit;
}

export interface SocketPayload {
  chatId: string;
  fromUserId?: string | number | null;
  toUserId?: string | number | null;
  signal: RTCSignal;
}

export class WebRTCConnection extends EventEmitter {
  pc: RTCPeerConnection | null = null;

  localStream: MediaStream | null;

  remoteStream: MediaStream = new MediaStream();

  candidateQueue: RTCIceCandidateInit[] = [];

  state: CallState = 'idle';

  private isHungUp = false;

  private socketHandler: ((payload: SocketPayload) => Promise<void>) | null = null;

  constructor(private options: WebRTCOptions) {
    super();
    this.localStream = options.localStream ?? null;

    this.socketHandler = async (payload: SocketPayload) => {
      if (payload.chatId !== this.options.chatId) return;
      const { signal } = payload;
      if (!signal) return;

      if (signal.type === 'offer' && !this.options.initiator) {
        await this.accept(signal.sdp);
      } else if (signal.type === 'answer' && this.options.initiator) {
        await this.pc?.setRemoteDescription(signal.sdp);
      } else if (signal.type === 'candidate') {
        await this.addCandidate(signal.candidate);
      } else if (signal.type === 'end') {
        this.hangUp();
      }
    };

    socket.on('webrtc_signal', this.socketHandler);
  }

  private initPeerConnection() {
    if (this.pc) return this.pc;
    this.pc = new RTCPeerConnection({ iceServers: this.options.iceServers });
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => this.pc!.addTrack(track, this.localStream!));
    }
    this.pc.ontrack = (ev) => {
      if (ev.streams && ev.streams[0]) {
        // eslint-disable-next-line prefer-destructuring
        this.remoteStream = ev.streams[0];
        this.emit('remoteStream', this.remoteStream);
      }
    };
    this.pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        socket.emit('webrtc_signal', {
          toUserId: this.options.toUserId,
          chatId: this.options.chatId,
          signal: { type: 'candidate', candidate: ev.candidate.toJSON() },
        });
      }
    };
    this.pc.onconnectionstatechange = () => {
      const state = this.pc?.connectionState;
      if (!state) return;
      if (state === 'connected') this.setState('connected');
      if (state === 'failed' || state === 'disconnected') {
        this.hangUp();
      }
    };

    this.drainQueue();
    return this.pc;
  }

  private setState(state: CallState) {
    this.state = state;
    this.emit('stateChange', state);
  }

  async call(): Promise<void> {
    if (!this.localStream) throw new Error('No local stream');
    const pc = this.initPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.setState('calling');
    socket.emit('webrtc_signal', {
      toUserId: this.options.toUserId,
      chatId: this.options.chatId,
      signal: { type: 'offer', sdp: offer },
    });
  }

  async accept(offer: RTCSessionDescriptionInit) {
    const pc = this.initPeerConnection();
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    this.setState('connected');
    socket.emit('webrtc_signal', {
      toUserId: this.options.toUserId,
      chatId: this.options.chatId,
      signal: { type: 'answer', sdp: answer },
    });
  }

  async addCandidate(candidate: RTCIceCandidateInit) {
    try {
      await this.pc?.addIceCandidate(candidate);
    } catch {
      this.candidateQueue.push(candidate);
    }
  }

  async drainQueue() {
    // eslint-disable-next-line no-restricted-syntax
    for (const c of this.candidateQueue) {
      // eslint-disable-next-line no-await-in-loop
      try {
        await this.pc?.addIceCandidate(c);
      } catch {
        /* empty */
      }
    }
    this.candidateQueue = [];
  }

  hangUp() {
    if (this.isHungUp) return;
    this.isHungUp = true;

    this.pc?.getSenders().forEach((s) => s.track?.stop());
    this.pc?.close();
    this.pc = null;
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.remoteStream.getTracks().forEach((t) => t.stop());
    this.candidateQueue = [];
    if (this.socketHandler) {
      socket.off('webrtc_signal', this.socketHandler);
      this.socketHandler = null;
    }
    this.setState('ended');
    this.emit('hangUp');
  }
}
