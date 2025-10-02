import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { getSubmissionsByUserId } from '../lib/mockData';
import type { QuizSubmission, SubmissionStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

const MyApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      // Simulate API call
      setTimeout(() => {
        setSubmissions(getSubmissionsByUserId(user.id));
        setLoading(false);
      }, 500);
    }
  }, [user, navigate]);
  
  const renderStatusBadge = (status: SubmissionStatus) => {
    const statusMap = {
      pending: { text: t('status_pending'), color: 'bg-yellow-500/20 text-yellow-400' },
      taken: { text: t('status_taken'), color: 'bg-blue-500/20 text-blue-400' },
      accepted: { text: t('status_accepted'), color: 'bg-green-500/20 text-green-400' },
      refused: { text: t('status_refused'), color: 'bg-red-500/20 text-red-400' },
    };
    const { text, color } = statusMap[status];
    return <span className={`px-3 py-1 text-sm font-bold rounded-full ${color}`}>{text}</span>;
  };
  
  if (loading) {
      return <div className="container mx-auto px-6 py-16 text-center">Loading applications...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-brand-light-blue rounded-full mb-4">
          <FileText className="text-brand-cyan" size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('page_title_my_applications')}</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-brand-dark-blue rounded-lg border border-brand-light-blue/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="border-b border-brand-light-blue/50 text-gray-300">
              <tr>
                <th className="p-4">{t('application_type')}</th>
                <th className="p-4">{t('submitted_on')}</th>
                <th className="p-4">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-400 text-lg">
                    {t('no_applications_submitted')}
                  </td>
                </tr>
              ) : submissions.map((sub, index) => (
                <tr key={sub.id} className={`border-b border-brand-light-blue/50 ${index === submissions.length - 1 ? 'border-none' : ''}`}>
                  <td className="p-4 font-semibold">{sub.quizTitle}</td>
                  <td className="p-4 text-sm text-gray-400">{new Date(sub.submittedAt).toLocaleString()}</td>
                  <td className="p-4">{renderStatusBadge(sub.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyApplicationsPage;
