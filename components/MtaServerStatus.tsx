import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { CONFIG } from '../lib/config';
import { getMtaServerStatus } from '../lib/mockData';
import { Server, Users, Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ServerStatus {
  name: string;
  players: number;
  maxPlayers: number;
}

const MtaServerStatus: React.FC = () => {
  const { t } = useLocalization();
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMtaServerStatus();
        setStatus(data);
      } catch (err) {
        setError("Server is currently offline.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
    // Optional: Refresh status periodically
    const interval = setInterval(fetchStatus, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const SkeletonLoader = () => (
    <div className="bg-brand-dark-blue border border-brand-light-blue/50 rounded-lg p-6 w-full max-w-2xl mx-auto animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-brand-light-blue rounded w-3/5"></div>
        <div className="h-5 bg-brand-light-blue rounded w-1/5"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-8 bg-brand-light-blue rounded w-1/4"></div>
        <div className="h-12 bg-brand-cyan/20 rounded-md w-1/3"></div>
      </div>
    </div>
  );

  if (isLoading && !status) {
    return <SkeletonLoader />;
  }

  return (
    <div className="bg-brand-dark-blue border border-brand-light-blue/50 rounded-lg p-6 w-full max-w-2xl mx-auto shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <Server size={24} className="text-brand-cyan" />
          <span>{status?.name || 'Horizon Roleplay Server'}</span>
        </h3>
        {error ? (
          <div className="flex items-center gap-2 text-red-400 font-semibold mt-2 sm:mt-0">
            <WifiOff size={18} />
            <span>Offline</span>
            {isLoading && <Loader2 size={16} className="animate-spin" />}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-400 font-semibold mt-2 sm:mt-0">
            <Wifi size={18} />
            <span>Online</span>
            {isLoading && <Loader2 size={16} className="animate-spin" />}
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-bold text-white">
          <Users size={28} className="text-brand-cyan" />
          <span>{status?.players ?? '??'} / {status?.maxPlayers ?? '???'}</span>
        </div>
        <a
          href={CONFIG.MTA_SERVER_URL}
          className="mt-4 sm:mt-0 bg-brand-cyan text-brand-dark font-bold py-3 px-8 rounded-md hover:bg-white hover:shadow-glow-cyan transition-all duration-300"
        >
          {t('connect_mta')}
        </a>
      </div>
    </div>
  );
};

export default MtaServerStatus;