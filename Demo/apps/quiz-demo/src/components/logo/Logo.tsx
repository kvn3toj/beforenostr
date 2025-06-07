import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="w-64 h-20 relative">
        <Image
          src="https://ext.same-assets.com/470095267/4269093415.svg"
          alt="Coomunity Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      <div className="text-white font-poppins font-light italic text-xl mt-1">
        Juntos Trascendemos
      </div>
    </div>
  );
};

export default Logo;
