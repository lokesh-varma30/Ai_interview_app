import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InterviewState, Candidate, Question } from '../../types';
import { aiService } from '../../services/aiService';
import { parseResume } from '../../services/resumeParser';
import { v4 as uuidv4 } from 'uuid';

const initialState: InterviewState = {
  currentCandidate: null,
  currentQuestionIndex: 0,
  isInterviewActive: false,
  isQuestionActive: false,
  timeRemaining: 0,
  showWelcomeBack: false,
  uploadedFile: null,
  extractedData: null,
  isLoading: false,
  error: null,
};

export const uploadResume = createAsyncThunk(
  'interview/uploadResume',
  async (file: File) => {
    const resumeData = await parseResume(file);
    return { file, resumeData };
  }
);

export const generateQuestions = createAsyncThunk(
  'interview/generateQuestions',
  async (resumeText: string) => {
    return await aiService.generateQuestions(resumeText);
  }
);

export const evaluateAnswer = createAsyncThunk(
  'interview/evaluateAnswer',
  async ({ question, answer, timeSpent }: { question: string; answer: string; timeSpent: number }) => {
    return await aiService.evaluateAnswer(question, answer, timeSpent);
  }
);

export const generateFinalSummary = createAsyncThunk(
  'interview/generateFinalSummary',
  async (questions: Question[]) => {
    return await aiService.generateFinalSummary(questions);
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCurrentCandidate: (state, action: PayloadAction<Candidate>) => {
      state.currentCandidate = action.payload;
    },
    updateCandidateInfo: (state, action: PayloadAction<{ name?: string; email?: string; phone?: string }>) => {
      if (state.currentCandidate) {
        Object.assign(state.currentCandidate, action.payload);
      }
    },
    startInterview: (state) => {
      state.isInterviewActive = true;
      state.currentQuestionIndex = 0;
    },
    startQuestion: (state) => {
      state.isQuestionActive = true;
      if (state.currentCandidate) {
        const currentQuestion = state.currentCandidate.questions[state.currentQuestionIndex];
        state.timeRemaining = currentQuestion.timeLimit;
      }
    },
    stopQuestion: (state) => {
      state.isQuestionActive = false;
    },
    updateTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining--;
      } else {
        state.isQuestionActive = false;
      }
    },
    submitAnswer: (state, action: PayloadAction<{ answer: string; timeSpent: number }>) => {
      if (state.currentCandidate) {
        const currentQuestion = state.currentCandidate.questions[state.currentQuestionIndex];
        currentQuestion.answer = action.payload.answer;
        currentQuestion.timeSpent = action.payload.timeSpent;
        currentQuestion.answeredAt = new Date().toISOString();
      }
      state.isQuestionActive = false;
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex++;
    },
    completeInterview: (state) => {
      state.isInterviewActive = false;
      if (state.currentCandidate) {
        state.currentCandidate.status = 'completed';
        state.currentCandidate.completedAt = new Date().toISOString();
      }
    },
    resetInterview: (state) => {
      return { ...initialState };
    },
    setShowWelcomeBack: (state, action: PayloadAction<boolean>) => {
      state.showWelcomeBack = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploadedFile = action.payload.file;
        state.extractedData = {
          name: action.payload.resumeData.name,
          email: action.payload.resumeData.email,
          phone: action.payload.resumeData.phone,
        };
        
        // Create new candidate
        const candidate: Candidate = {
          id: uuidv4(),
          name: action.payload.resumeData.name || '',
          email: action.payload.resumeData.email || '',
          phone: action.payload.resumeData.phone || '',
          resumeText: action.payload.resumeData.text,
          resumeFileName: action.payload.file.name,
          questions: [],
          finalScore: 0,
          finalSummary: '',
          createdAt: new Date().toISOString(),
          status: 'in-progress',
        };
        
        state.currentCandidate = candidate;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to process resume';
      })
      .addCase(generateQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentCandidate) {
          state.currentCandidate.questions = action.payload;
        }
      })
      .addCase(generateQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to generate questions';
      })
      .addCase(evaluateAnswer.fulfilled, (state, action) => {
        if (state.currentCandidate) {
          const currentQuestion = state.currentCandidate.questions[state.currentQuestionIndex];
          currentQuestion.score = action.payload.score;
          currentQuestion.feedback = action.payload.feedback;
        }
      })
      .addCase(generateFinalSummary.fulfilled, (state, action) => {
        if (state.currentCandidate) {
          state.currentCandidate.finalScore = action.payload.score;
          state.currentCandidate.finalSummary = action.payload.summary;
        }
      });
  },
});

export const {
  setCurrentCandidate,
  updateCandidateInfo,
  startInterview,
  startQuestion,
  stopQuestion,
  updateTimer,
  submitAnswer,
  nextQuestion,
  completeInterview,
  resetInterview,
  setShowWelcomeBack,
  clearError,
} = interviewSlice.actions;

export default interviewSlice.reducer;