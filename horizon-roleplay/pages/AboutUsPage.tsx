import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Info } from 'lucide-react';
import DiscordEmbed from '../components/DiscordEmbed';

const AboutUsPage: React.FC = () => {
  const { t } = useLocalization();

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-brand-light-blue rounded-full mb-4">
          <Info className="text-brand-cyan" size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('page_title_about')}</h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('about_intro')}</p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-brand-dark-blue p-8 rounded-lg border border-brand-light-blue">
          <h2 className="text-3xl font-bold text-brand-cyan mb-4">{t('our_mission')}</h2>
          <p className="text-gray-300 leading-relaxed">
            {t('mission_text')}
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center">
           {/* FIX: Removed unsupported 'inviteUrl' prop. The component uses a global config for the invite link. */}
           <DiscordEmbed 
             serverName="Horizon Roleplay"
           />
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;