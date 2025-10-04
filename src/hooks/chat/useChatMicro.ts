import { Dispatch, SetStateAction, useRef, useState } from 'react';

import { useUploadFileMutation } from '@/services/file';

export const useChatMicro = ({
  setNewVoiceMessage,
}: {
  setNewVoiceMessage: Dispatch<SetStateAction<string | null>>;
}) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [uploadFile] = useUploadFileMutation();

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const result = await uploadFile(audioBlob);
      setNewVoiceMessage(result?.data.uuid);
      audioChunks.current = [];
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setRecording(false);
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return [recording, startRecording, stopRecording] as const;
};
