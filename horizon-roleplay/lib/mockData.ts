import type { Product, Quiz, QuizSubmission, SubmissionStatus, User } from '../types';

// Mock data for the store
let products: Product[] = [
  {
    id: 'prod_001',
    nameKey: 'product_vip_bronze_name',
    descriptionKey: 'product_vip_bronze_desc',
    price: 9.99,
    imageUrl: 'https://picsum.photos/seed/vip_bronze/400/300'
  },
  {
    id: 'prod_002',
    nameKey: 'product_vip_silver_name',
    descriptionKey: 'product_vip_silver_desc',
    price: 19.99,
    imageUrl: 'https://picsum.photos/seed/vip_silver/400/300'
  },
  {
    id: 'prod_003',
    nameKey: 'product_cash_1_name',
    descriptionKey: 'product_cash_1_desc',
    price: 4.99,
    imageUrl: 'https://picsum.photos/seed/cash_pack/400/300'
  },
  {
    id: 'prod_004',
    nameKey: 'product_custom_plate_name',
    descriptionKey: 'product_custom_plate_desc',
    price: 14.99,
    imageUrl: 'https://picsum.photos/seed/license_plate/400/300'
  },
];

// Mock data for quizzes/applications
let quizzes: Quiz[] = [
  {
    id: 'quiz_police_dept',
    titleKey: 'quiz_police_name',
    descriptionKey: 'quiz_police_desc',
    isOpen: true,
    questions: [
      { id: 'q1', textKey: 'q_police_1', timeLimit: 60 },
      { id: 'q2', textKey: 'q_police_2', timeLimit: 90 },
    ],
  },
  {
    id: 'quiz_ems_dept',
    titleKey: 'quiz_medic_name',
    descriptionKey: 'quiz_medic_desc',
    isOpen: false,
    questions: [
      { id: 'q1', textKey: 'q_medic_1', timeLimit: 75 },
    ],
  },
];

// Mock database for submissions
let submissions: QuizSubmission[] = [];

// --- QUIZ API ---
const getQuizzes = (): Quiz[] => JSON.parse(JSON.stringify(quizzes));
const getQuizById = (id: string): Quiz | undefined => JSON.parse(JSON.stringify(quizzes.find(q => q.id === id)));
const saveQuiz = (quizToSave: Quiz): void => {
    const index = quizzes.findIndex(q => q.id === quizToSave.id);
    if (index !== -1) {
        quizzes[index] = quizToSave;
    } else {
        quizzes.push(quizToSave);
    }
}
const deleteQuiz = (quizId: string): void => {
    quizzes = quizzes.filter(q => q.id !== quizId);
}

// --- SUBMISSION API ---
const getSubmissions = (): QuizSubmission[] => {
  // Sort by newest first
  return JSON.parse(JSON.stringify(submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())));
}

const getSubmissionsByUserId = (userId: string): QuizSubmission[] => {
  return getSubmissions().filter(sub => sub.userId === userId);
}

const addSubmission = (submission: Omit<QuizSubmission, 'id' | 'status'>): void => {
    const newSubmission: QuizSubmission = {
      ...submission,
      id: `sub_${Date.now()}`,
      status: 'pending',
    }
    submissions.push(newSubmission);
}

const updateSubmissionStatus = (submissionId: string, status: SubmissionStatus, admin?: User): void => {
  const index = submissions.findIndex(sub => sub.id === submissionId);
  if (index !== -1) {
    submissions[index].status = status;
    if (admin && (status === 'taken' || status === 'accepted' || status === 'refused')) {
      submissions[index].adminId = admin.id;
      submissions[index].adminUsername = admin.username;
    }
    
    // --- BACKEND INTEGRATION POINT ---
    // In a real application, this is where you would trigger a call to your backend.
    if (status === 'accepted' || status === 'refused') {
      console.log(`--- NOTIFICATION FOR BACKEND ---`);
      console.log(`User: ${submissions[index].username} (${submissions[index].userId})`);
      console.log(`Application: ${submissions[index].quizTitle}`);
      console.log(`Status changed to: ${status}`);
      console.log(`Action by Admin: ${admin?.username}`);
      console.log(`Your backend should now send a notification (e.g., a Discord DM) to the user.`);
      console.log(`------------------------------`);
    }
  }
}

// --- MTA SERVER API ---
interface MtaServerStatus {
    name: string;
    players: number;
    maxPlayers: number;
}

const getMtaServerStatus = async (): Promise<MtaServerStatus> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate a chance of the server being offline
    if (Math.random() < 0.1) { // 10% chance of being offline
        return Promise.reject(new Error("Server is offline"));
    }

    // Simulate player count fluctuation
    const players = 80 + Math.floor(Math.random() * 40); // 80-120 players
    const maxPlayers = 200;

    return {
        name: 'Horizon Roleplay | Your Story Begins',
        players,
        maxPlayers,
    };
}


export { products, getQuizzes, getQuizById, saveQuiz, deleteQuiz, getSubmissions, getSubmissionsByUserId, addSubmission, updateSubmissionStatus, getMtaServerStatus };