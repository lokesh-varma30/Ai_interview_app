export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeText: string;
  resumeFileName: string;
  questions: Question[];
  finalScore: number;
  finalSummary: string;
  createdAt: string;
  completedAt?: string;
  status: 'in-progress' | 'completed';
}

export interface Question {
  id: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in seconds
  answer?: string;
  score?: number;
  feedback?: string;
  timeSpent?: number;
  answeredAt?: string;
}

export interface InterviewState {
  currentCandidate: Candidate | null;
  currentQuestionIndex: number;
  isInterviewActive: boolean;
  isQuestionActive: boolean;
  timeRemaining: number;
  showWelcomeBack: boolean;
  uploadedFile: File | null;
  extractedData: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export interface CandidatesState {
  candidates: Candidate[];
  selectedCandidate: string | null;
  searchTerm: string;
  sortBy: 'name' | 'score' | 'date';
  sortOrder: 'asc' | 'desc';
}

export interface UIState {
  activeTab: 'interviewee' | 'interviewer';
  showCandidateDetails: boolean;
}

export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  text: string;
}