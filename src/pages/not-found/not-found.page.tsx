import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const NotFoundPage = () => {
  const route = useNavigate();

  return (
    <div className="h-[100vh] w-full animated-bg">
      <Button
        onClick={() => route('/')}
        className="absolute bg-card rounded-none cut cut-left-5 cut-right-5 mt-10 ml-10"
      >
        <ArrowLeftIcon className="w-6 h-6" />
        Go to home page
      </Button>
      <div className="w-full h-full justify-center items-center flex flex-col md:flex-row gap-2 animate-slide-in-left-slow">
        <h1 className="text-[72px] md:text-[128px]">404</h1>
        <h2 className="text-[32px] md:text-[48px]">Page Not Found</h2>
      </div>
    </div>
  );
};
