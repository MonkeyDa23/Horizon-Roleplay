
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { 
  getQuizzes, 
  saveQuiz as saveQuizToDb, 
  deleteQuiz as deleteQuizFromDb,
  getSubmissions,
  updateSubmissionStatus
} from '../lib/mockData';
import type { Quiz, QuizQuestion, QuizSubmission, SubmissionStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import { UserCog, Plus, Edit, Trash2, Check, X, FileText, Server, Eye } from 'lucide-react';
import Modal from '../components/Modal';

type AdminTab = 'submissions' | 'quizzes';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('submissions');
  
  // State for Quiz Management
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // State for Submission Management
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [viewingSubmission, setViewingSubmission] = useState<QuizSubmission | null>(null);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    } else {
      setQuizzes(getQuizzes());
      setSubmissions(getSubmissions());
    }
  }, [user, navigate]);
  
  const refreshSubmissions = () => {
      setSubmissions(getSubmissions());
  }

  // --- Quiz Management Functions ---
  const handleCreateNewQuiz = () => {
    setEditingQuiz({
      id: `quiz_${Date.now()}`,
      titleKey: '',
      descriptionKey: '',
      isOpen: false,
      questions: [{ id: `q_${Date.now()}`, textKey: '', timeLimit: 60 }],
    });
  };
  const handleEditQuiz = (quiz: Quiz) => setEditingQuiz(JSON.parse(JSON.stringify(quiz)));
  const handleDeleteQuiz = (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      deleteQuizFromDb(quizId);
      setQuizzes(getQuizzes());
    }
  };
  const handleSaveQuiz = () => {
    if (editingQuiz) {
      saveQuizToDb(editingQuiz);
      setQuizzes(getQuizzes());
      setEditingQuiz(null);
    }
  };

  // --- Submission Management Functions ---
  const handleTakeOrder = (submissionId: string) => {
      if(user) {
        updateSubmissionStatus(submissionId, 'taken', user);
        refreshSubmissions();
      }
  }

  const handleDecision = (submissionId: string, decision: 'accepted' | 'refused') => {
      if(user) {
        updateSubmissionStatus(submissionId, decision, user);
        refreshSubmissions();
        setViewingSubmission(null);
      }
  }

  if (!user?.isAdmin) return null;

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
  
  // --- RENDER METHODS ---

  const QuizEditor = () => editingQuiz && (
    <div className="bg-brand-dark-blue p-8 rounded-lg space-y-6 mt-6">
      <h3 className="text-2xl font-bold mb-6">{t(editingQuiz.id.startsWith('quiz_') ? 'create_new_quiz' : 'edit_quiz')}</h3>
      <div>
        <label className="block mb-2 font-semibold text-gray-300">{t('quiz_title')}</label>
        <input type="text" value={editingQuiz.titleKey} onChange={(e) => setEditingQuiz({...editingQuiz, titleKey: e.target.value})} className="w-full bg-brand-light-blue p-2 rounded border border-gray-600" />
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-300">{t('quiz_description')}</label>
        <textarea value={editingQuiz.descriptionKey} onChange={(e) => setEditingQuiz({...editingQuiz, descriptionKey: e.target.value})} className="w-full bg-brand-light-blue p-2 rounded border border-gray-600" rows={3}></textarea>
      </div>
       <div className="flex items-center gap-4">
          <label className="font-semibold text-gray-300">{t('status')}:</label>
          <button onClick={() => setEditingQuiz({...editingQuiz, isOpen: !editingQuiz.isOpen})}
            className={`px-4 py-1 rounded-full font-bold ${editingQuiz.isOpen ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
            {editingQuiz.isOpen ? t('open') : t('closed')}
          </button>
        </div>
      <h4 className="text-xl font-bold border-b border-brand-light-blue pb-2">{t('quiz_questions')}</h4>
      {editingQuiz.questions.map((q, qIndex) => (
        <div key={q.id} className="bg-brand-dark p-4 rounded-md border border-brand-light-blue/50 space-y-3">
          <div className="flex justify-between items-center">
            <h5 className="font-semibold">{t('question')} {qIndex + 1}</h5>
            <button onClick={() => {
                if (editingQuiz.questions.length > 1) {
                    const newQuestions = editingQuiz.questions.filter((_, i) => i !== qIndex);
                    setEditingQuiz({...editingQuiz, questions: newQuestions });
                }
            }} className="text-red-500 hover:text-red-400 disabled:opacity-50" disabled={editingQuiz.questions.length <= 1}><Trash2 size={18} /></button>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-400">{t('question_text')}</label>
            <input type="text" value={q.textKey} onChange={(e) => {
                const newQuestions = [...editingQuiz.questions];
                newQuestions[qIndex].textKey = e.target.value;
                setEditingQuiz({...editingQuiz, questions: newQuestions});
            }} className="w-full bg-brand-light-blue p-2 rounded border border-gray-600" />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-400">{t('time_limit_seconds')}</label>
            <input type="number" value={q.timeLimit} onChange={(e) => {
                 const newQuestions = [...editingQuiz.questions];
                 newQuestions[qIndex].timeLimit = parseInt(e.target.value);
                 setEditingQuiz({...editingQuiz, questions: newQuestions});
            }} className="w-32 bg-brand-light-blue p-2 rounded border border-gray-600" />
          </div>
        </div>
      ))}
      <button onClick={() => {
          const newQuestion: QuizQuestion = { id: `q_${Date.now()}`, textKey: '', timeLimit: 60 };
          setEditingQuiz({...editingQuiz, questions: [...editingQuiz.questions, newQuestion]});
      }} className="flex items-center gap-2 text-brand-cyan font-semibold"><Plus size={18} /> {t('add_question')}</button>
      <div className="flex justify-end gap-4 pt-6">
        <button onClick={() => setEditingQuiz(null)} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-500 transition-colors">Cancel</button>
        <button onClick={handleSaveQuiz} className="bg-brand-cyan text-brand-dark font-bold py-2 px-6 rounded-md hover:bg-white transition-colors">{t('save_quiz')}</button>
      </div>
    </div>
  );

  const SubmissionsPanel = () => (
    <div className="bg-brand-dark-blue rounded-lg border border-brand-light-blue/50 mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="border-b border-brand-light-blue/50 text-gray-300">
            <tr>
              <th className="p-4">{t('applicant')}</th>
              <th className="p-4">{t('quiz_title')}</th>
              <th className="p-4">{t('submitted_on')}</th>
              <th className="p-4">{t('status')}</th>
              <th className="p-4 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">{t('no_pending_submissions')}</td></tr>
            ) : submissions.map((sub, index) => (
              <tr key={sub.id} className={`border-b border-brand-light-blue/50 ${index === submissions.length - 1 ? 'border-none' : ''}`}>
                <td className="p-4 font-semibold">{sub.username}</td>
                <td className="p-4">{sub.quizTitle}</td>
                <td className="p-4 text-sm text-gray-400">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                <td className="p-4">{renderStatusBadge(sub.status)}</td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-4 items-center">
                    {sub.status === 'pending' && (
                      <button onClick={() => handleTakeOrder(sub.id)} className="bg-brand-cyan/20 text-brand-cyan font-bold py-1 px-3 rounded-md hover:bg-brand-cyan/40 text-sm">{t('take_order')}</button>
                    )}
                    {sub.status === 'taken' && (
                      <span className="text-xs text-gray-400 italic">{t('taken_by')} {sub.adminUsername === user.username ? 'You' : sub.adminUsername}</span>
                    )}
                     <button onClick={() => setViewingSubmission(sub)} className="text-gray-300 hover:text-brand-cyan" title={t('view_submission')}><Eye size={20}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const QuizzesPanel = () => (
      <div>
        <div className="flex justify-between items-center my-6">
            <h2 className="text-2xl font-bold">{t('quiz_management')}</h2>
            <button onClick={handleCreateNewQuiz} className="bg-brand-cyan text-brand-dark font-bold py-2 px-4 rounded-md hover:bg-white transition-all flex items-center gap-2">
                <Plus size={20} />
                {t('create_new_quiz')}
            </button>
        </div>
        {editingQuiz ? <QuizEditor /> : (
        <div className="bg-brand-dark-blue rounded-lg border border-brand-light-blue/50">
          <table className="w-full text-left">
            <thead className="border-b border-brand-light-blue/50 text-gray-300">
              <tr>
                <th className="p-4">{t('quiz_title')}</th>
                <th className="p-4">{t('status')}</th>
                <th className="p-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr key={quiz.id} className={`border-b border-brand-light-blue/50 ${index === quizzes.length - 1 ? 'border-none' : ''}`}>
                  <td className="p-4 font-semibold">{t(quiz.titleKey)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${quiz.isOpen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {quiz.isOpen ? t('open') : t('closed')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-4">
                       <button onClick={() => handleEditQuiz(quiz)} className="text-gray-300 hover:text-brand-cyan"><Edit size={20}/></button>
                       <button onClick={() => handleDeleteQuiz(quiz.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={20}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
  );


  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-brand-light-blue rounded-full mb-4">
          <UserCog className="text-brand-cyan" size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('page_title_admin')}</h1>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="flex border-b border-brand-light-blue/50 mb-6">
            <button onClick={() => setActiveTab('submissions')} className={`py-3 px-6 font-bold flex items-center gap-2 ${activeTab === 'submissions' ? 'text-brand-cyan border-b-2 border-brand-cyan' : 'text-gray-400'}`}>
                <FileText size={18}/> {t('submission_management')}
            </button>
            <button onClick={() => setActiveTab('quizzes')} className={`py-3 px-6 font-bold flex items-center gap-2 ${activeTab === 'quizzes' ? 'text-brand-cyan border-b-2 border-brand-cyan' : 'text-gray-400'}`}>
                <Server size={18}/> {t('quiz_management')}
            </button>
        </div>
        
        {activeTab === 'submissions' ? <SubmissionsPanel /> : <QuizzesPanel />}
      </div>

      {viewingSubmission && (
        <Modal isOpen={!!viewingSubmission} onClose={() => setViewingSubmission(null)} title={t('submission_details')}>
            <div className="space-y-4 text-gray-200">
                <p><strong>{t('applicant')}:</strong> {viewingSubmission.username}</p>
                <p><strong>{t('quiz_title')}:</strong> {viewingSubmission.quizTitle}</p>
                <p><strong>{t('submitted_on')}:</strong> {new Date(viewingSubmission.submittedAt).toLocaleString()}</p>
                <p><strong>{t('status')}:</strong> {renderStatusBadge(viewingSubmission.status)}</p>
                {viewingSubmission.adminUsername && <p><strong>{t('taken_by')}:</strong> {viewingSubmission.adminUsername}</p>}
                <div className="border-t border-brand-light-blue pt-4 mt-4">
                    <h4 className="text-lg font-bold text-brand-cyan mb-2">{t('quiz_questions')}</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {viewingSubmission.answers.map((ans, i) => (
                            <div key={ans.questionId}>
                                <p className="font-semibold text-gray-300">{i+1}. {ans.questionText}</p>
                                <p className="bg-brand-dark p-2 rounded mt-1 text-gray-200 whitespace-pre-wrap">{ans.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {viewingSubmission.status === 'taken' && viewingSubmission.adminId === user.id && (
                    <div className="flex justify-end gap-4 pt-6 border-t border-brand-light-blue">
                        <button onClick={() => handleDecision(viewingSubmission.id, 'refused')} className="flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-5 rounded-md hover:bg-red-500 transition-colors">
                            <X size={20}/> {t('refuse')}
                        </button>
                        <button onClick={() => handleDecision(viewingSubmission.id, 'accepted')} className="flex items-center gap-2 bg-green-600 text-white font-bold py-2 px-5 rounded-md hover:bg-green-500 transition-colors">
                            <Check size={20}/> {t('accept')}
                        </button>
                    </div>
                )}
            </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminPage;
