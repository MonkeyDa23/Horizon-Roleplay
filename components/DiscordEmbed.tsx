import React, { useState, useEffect } from 'react';
import Logo from './icons/Logo';
import { useLocalization } from '../hooks/useLocalization';
import { CONFIG } from '../lib/config';

interface DiscordEmbedProps {
  serverName: string;
  baseOnline?: number;
  baseTotal?: number;
}

const DiscordEmbed: React.FC<DiscordEmbedProps> = ({
  serverName,
  baseOnline = 1234,
  baseTotal = 5678,
}) => {
  const { t } = useLocalization();
  const [onlineMembers, setOnlineMembers] = useState(baseOnline);
  const [totalMembers, setTotalMembers] = useState(baseTotal);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluctuation in member counts for a dynamic feel
      const onlineFluctuation = Math.floor(Math.random() * 21) - 10; // -10 to +10
      const totalFluctuation = Math.floor(Math.random() * 5); // 0 to 4 new members
      
      setOnlineMembers(prev => Math.max(200, prev + onlineFluctuation)); // Keep a baseline
      setTotalMembers(prev => prev + totalFluctuation);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [baseOnline, baseTotal]);

  return (
    <div className="bg-[#2B2D31] p-4 rounded-lg w-full max-w-sm mx-auto border-l-4 border-brand-cyan shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-brand-dark rounded-full p-1">
          <Logo className="w-10 h-10" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">{serverName}</h3>
          <p className="text-xs text-gray-400">
            {t('join_community')}
          </p>
        </div>
      </div>
      <div className="space-y-2 text-gray-300 mb-4 px-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>
            {onlineMembers.toLocaleString()} {t('discord_online')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 bg-gray-500 rounded-full"></span>
          <span>
            {totalMembers.toLocaleString()} {t('discord_members')}
          </span>
        </div>
      </div>
      <a
        href={CONFIG.DISCORD_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-brand-cyan text-brand-dark font-bold py-2.5 rounded-md hover:bg-white transition-all duration-300 shadow-glow-cyan-light"
      >
        {t('join_us')}
      </a>
    </div>
  );
};

export default DiscordEmbed;
