
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { CONFIG } from '../lib/config';
import { Disc3 } from 'lucide-react'; // Using Disc3 for Discord icon

const Footer: React.FC = () => {
  const { t } = useLocalization();

  return (
    <footer className="bg-brand-dark-blue border-t border-brand-light-blue/50 mt-16">
      <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-start">
        <p className="text-gray-400 text-sm">{t('footer_rights')}</p>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <a href={CONFIG.DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-cyan transition-colors">
            <Disc3 size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
