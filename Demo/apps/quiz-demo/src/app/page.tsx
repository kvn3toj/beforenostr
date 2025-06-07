'use client';
import { useState } from 'react';
import Logo from '@/components/logo/Logo';
import VideoPlayer from '@/components/video/VideoPlayer';
import QuizContainer from '@/components/quiz/QuizContainer';

export default function Home() {
  const [videoFinished, setVideoFinished] = useState(false);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Video Section */}
      <div className="container-fw bg-black border-bottom-red">
        <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
          <VideoPlayer
            videoSrc="/assets/videos/loop/LoopMorpheo.mp4"
            className="w-full h-full"
          />

          {/* Logo Overlay */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <Logo className="z-10 transform scale-75 sm:scale-90 md:scale-100" />
          </div>

          {/* Instruction Overlay */}
          <div className="absolute bottom-4 left-0 w-full text-center text-white p-4">
            <p className="text-sm sm:text-base md:text-lg">Observa el video y toma una decisión al final.</p>
            <button
              className="mt-4 btn-rose btn-round px-4 py-1 sm:px-6 sm:py-2 text-sm sm:text-base"
              onClick={() => setVideoFinished(true)}
            >
              Avanzar
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Section - only shown after video */}
      {videoFinished && (
        <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4">
          <QuizContainer />
        </div>
      )}
    </main>
  );
}
