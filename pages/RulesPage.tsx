
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { BookOpen } from 'lucide-react';

const RulesPage: React.FC = () => {
  const { t } = useLocalization();

  return (
    <div className="container mx-auto px-6 py-16 text-center">
       <div className="flex justify-center items-center mb-6">
        <BookOpen className="text-brand-cyan" size={48} />
      </div>
      <h1 className="text-4xl font-bold mb-4">{t('page_title_rules')}</h1>
      <p className="text-2xl text-gray-400">{t('coming_soon')}</p>
    </div>
  );
};

export default RulesPage;
