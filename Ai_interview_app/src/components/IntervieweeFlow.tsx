import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setShowWelcomeBack } from '../store/slices/interviewSlice';
import ResumeUpload from './interviewee/ResumeUpload';
import ChatInterface from './interviewee/ChatInterface';
import QuestionCard from './interviewee/QuestionCard';
import FinalScore from './interviewee/FinalScore';

const IntervieweeFlow: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    currentCandidate, 
    isInterviewActive, 
    extractedData,
    currentQuestionIndex 
  } = useSelector((state: RootState) => state.interview);

  // Check for existing session on mount
  useEffect(() => {
    if (currentCandidate && currentCandidate.status === 'in-progress') {
      const hasAnsweredQuestions = currentCandidate.questions.some(q => q.answer);
      if (hasAnsweredQuestions) {
        dispatch(setShowWelcomeBack(true));
      }
    }
  }, [currentCandidate, dispatch]);

  // Show final score if interview is completed
  if (currentCandidate && currentCandidate.status === 'completed') {
    return <FinalScore />;
  }

  // Show questions if interview is active
  if (isInterviewActive && currentCandidate && currentCandidate.questions.length > 0) {
    return <QuestionCard />;
  }

  // Show chat for collecting missing info
  if (extractedData && (!extractedData.name || !extractedData.email || !extractedData.phone || 
      (currentCandidate && currentCandidate.questions.length === 0))) {
    return <ChatInterface />;
  }

  // Default: show resume upload
  return <ResumeUpload />;
};

export default IntervieweeFlow;