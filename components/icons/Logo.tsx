
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#00f2ea" />
          <stop offset="100%" stopColor="#00c9c2" />
        </linearGradient>
      </defs>
      <path 
        d="M36.1,105.4c-8,0-14.5-6.5-14.5-14.5V29c0-8,6.5-14.5,14.5-14.5h0.4c8,0,14.5,6.5,14.5,14.5v19.7c0,2.5-2,4.5-4.5,4.5H38.8c-2.5,0-4.5-2-4.5-4.5V33.5c0-2.5-2-4.5-4.5-4.5s-4.5,2-4.5,4.5v57.9c0,2.5,2,4.5,4.5,4.5s4.5-2,4.5-4.5v-7.8c0-2.5,2-4.5,4.5-4.5h7.7c2.5,0,4.5,2,4.5,4.5v12.2C50.6,98.9,44.1,105.4,36.1,105.4z" 
        fill="url(#logoGradient)" 
      />
      <path 
        d="M93.3,105.4c-8,0-14.5-6.5-14.5-14.5V74.8c0-2.3,1.3-4.4,3.4-5.4L98,59.2c1.9-0.9,4.2-0.2,5.3,1.5l1.6,2.5c1.2,1.9,0.5,4.4-1.4,5.6l-14,8.1c-1.3,0.7-2,2.2-2,3.7v10.3c0,2.5,2,4.5,4.5,4.5s4.5-2,4.5-4.5V89.4c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5v1.4c0,8-6.5,14.5-14.5,14.5z" 
        fill="url(#logoGradient)" 
      />
    </svg>
  );
};

export default Logo;
