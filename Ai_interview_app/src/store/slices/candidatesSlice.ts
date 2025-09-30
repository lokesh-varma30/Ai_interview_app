import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CandidatesState, Candidate } from '../../types';

const initialState: CandidatesState = {
  candidates: [],
  selectedCandidate: null,
  searchTerm: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      const existingIndex = state.candidates.findIndex(c => c.id === action.payload.id);
      if (existingIndex !== -1) {
        state.candidates[existingIndex] = action.payload;
      } else {
        state.candidates.push(action.payload);
      }
    },
    updateCandidate: (state, action: PayloadAction<Candidate>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = action.payload;
      }
    },
    selectCandidate: (state, action: PayloadAction<string | null>) => {
      state.selectedCandidate = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'score' | 'date'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    deleteCandidateById: (state, action: PayloadAction<string>) => {
      state.candidates = state.candidates.filter(c => c.id !== action.payload);
      if (state.selectedCandidate === action.payload) {
        state.selectedCandidate = null;
      }
    },
  },
});

export const {
  addCandidate,
  updateCandidate,
  selectCandidate,
  setSearchTerm,
  setSortBy,
  setSortOrder,
  deleteCandidateById,
} = candidatesSlice.actions;

export default candidatesSlice.reducer;