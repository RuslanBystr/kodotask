import { PauseIcon, PlayIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

export default function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const stopAllAudio = () => {
    const audios = document.querySelectorAll('audio');
    audios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setIsPlaying(false);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        stopAllAudio();
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        setIsPlaying(false);
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(progress);
      }
    };

    audioRef.current?.addEventListener('pause', () => setIsPlaying(false));
    audioRef.current?.addEventListener('ended', handleAudioEnd);

    audioRef.current?.addEventListener('timeupdate', updateProgress);
  }, []);

  return (
    <div className="audio-container">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio controls ref={audioRef} className="audio hidden" onContextMenu={(e) => e.stopPropagation()}>
        <source src={src} type="audio/webm" />
        <source src={src} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <div className="flex items-center rounded-lg w-full">
        <Button
          className="play-btn bg-teal-500 h-10 w-10 mr-2 text-white cursor-pointer hover:bg-teal-400 rounded-[13px]"
          onClick={handlePlayPause}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <div className="min-w-[50px] w-full h-2 bg-teal-700 rounded-md mt-2 cursor-pointer relative">
          <div
            className="h-full bg-teal-500 rounded-md transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
