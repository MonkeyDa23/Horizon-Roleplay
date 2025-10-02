import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { CONFIG } from '../lib/config';
import Modal from '../components/Modal';
import Logo from '../components/icons/Logo';
import { Disc3, Gamepad2 } from 'lucide-react';
import MtaServerStatus from '../components/MtaServerStatus';

const HomePage: React.FC = () => {
  const { t } = useLocalization();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative h-[calc(100vh-68px)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none">
          <Logo className="w-full h-full" />
        </div>
        <div 
          className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"
        ></div>
        <div 
          className="absolute inset-0 bg-gradient-to-r from-brand-dark via-transparent to-brand-dark"
        ></div>
        
        <div className="text-center z-10 p-6 animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white" style={{ textShadow: '0 0 20px rgba(0, 242, 234, 0.4)' }}>
            {t('hero_title')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {t('hero_subtitle')}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-10 px-10 py-4 bg-brand-cyan text-brand-dark font-bold text-lg rounded-lg shadow-glow-cyan hover:bg-white hover:scale-105 transform transition-all duration-300 ease-in-out"
          >
            {t('join_us')}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <MtaServerStatus />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('join_modal_title')}>
        <div className="space-y-6">
          <a
            href={CONFIG.DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-4 w-full p-4 bg-blue-500/80 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors duration-300"
          >
            <Disc3 size={24} />
            <span>{t('join_discord')}</span>
          </a>
          <a
            href={CONFIG.MTA_SERVER_URL}
            className="flex items-center justify-center gap-4 w-full p-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors duration-300"
          >
            <Gamepad2 size={24} />
            <span>{t('connect_mta')}</span>
          </a>
        </div>
      </Modal>
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default HomePage;