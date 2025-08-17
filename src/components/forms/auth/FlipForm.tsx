import { useState } from 'react';

import { SignUpForm } from '@/components/forms/auth/SignUpForm';

import { SignInForm } from './SignInForm';

export const FlippableAuthCard = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative w-full max-w-sm min-h-[520px] perspective">
      <div
        className={`relative w-full h-full transition-transform duration-500 ease-in-out transform-style-preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        <div
          aria-hidden={flipped}
          inert={flipped}
          className={`absolute inset-0 backface-hidden transition-opacity duration-300 ${
            flipped ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
          }`}
        >
          <SignInForm onFlip={() => setFlipped(true)} />
        </div>

        <div
          aria-hidden={!flipped}
          inert={!flipped}
          className={`absolute inset-0 rotate-y-180 backface-hidden transition-opacity duration-300 ${
            flipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <SignUpForm onFlip={() => setFlipped(false)} />
        </div>
      </div>
    </div>
  );
};
