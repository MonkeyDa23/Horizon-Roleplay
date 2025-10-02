export type Language = 'ar' | 'en';

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  isAdmin: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

// Store & Cart
export interface Product {
  id: string;
  nameKey: string; // Key for translation
  descriptionKey: string; // Key for translation
  price: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Quiz & Application System
export interface QuizQuestion {
  id: string;
  textKey: string; // Key for translation
  timeLimit: number; // in seconds
}

export interface Quiz {
  id: string;
  titleKey: string; // Key for translation
  descriptionKey: string; // These are the rules shown before starting
  questions: QuizQuestion[];
  isOpen: boolean;
}

export interface Answer {
  questionId: string;
  questionText: string;
  answer: string;
}

export type SubmissionStatus = 'pending' | 'taken' | 'accepted' | 'refused';

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  username: string;
  answers: Answer[];
  submittedAt: string;
  status: SubmissionStatus;
  adminId?: string; // ID of the admin who claimed/handled it
  adminUsername?: string; // Username of the admin
}
