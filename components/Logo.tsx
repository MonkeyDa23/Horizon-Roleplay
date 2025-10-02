
import React from 'react';
import { CONFIG } from '../lib/config';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img 
      src={CONFIG.LOGO_URL} 
      alt="Horizon Roleplay Logo" 
      className={className} 
    />
  );
};

export default Logo;
