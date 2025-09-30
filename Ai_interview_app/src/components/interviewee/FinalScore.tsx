import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trophy, RotateCcw, Eye, CheckCircle } from 'lucide-react';
import { RootState } from '../../store';
import { resetInterview } from '../../store/slices/interviewSlice';
import { setActiveTab, setShowCandidateDetails } from '../../store/slices/uiSlice';
import { selectCandidate } from '../../store/slices/candidatesSlice';
import { getScoreColor, getScoreBadgeColor, formatDate } from '../../utils/helpers';

const FinalScore: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCandidate } = useSelector((state: RootState) => state.interview);

  if (!currentCandidate || currentCandidate.status !== 'completed') {
    return null;
  }

  const handleStartNew = () => {
    dispatch(resetInterview());
  };

  const handleViewDetails = () => {
    dispatch(selectCandidate(currentCandidate.id));
    dispatch(setShowCandidateDetails(true));
    dispatch(setActiveTab('interviewer'));
  };

  const answeredQuestions = currentCandidate.questions.filter(q => q.answer);
  const avgScore = answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / answeredQuestions.length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Interview Completed!</h1>
              <p className="text-blue-100">
                Great job, {currentCandidate.name}! Here's your final assessment.
              </p>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="text-center">
            <div className={text-6xl font-bold mb-2 ${getScoreColor(currentCandidate.finalScore)}}>
              {currentCandidate.finalScore}
              <span className="text-2xl text-gray-500">/10</span>
            </div>
            <div className={inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBadgeColor(currentCandidate.finalScore)}}>
              <CheckCircle className="w-4 h-4 mr-1" />
              {currentCandidate.finalScore >= 8 ? 'Excellent' :
               currentCandidate.finalScore >= 6 ? 'Good' :
               currentCandidate.finalScore >= 4 ? 'Fair' : 'Needs Improvement'}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              Completed on {formatDate(currentCandidate.completedAt || currentCandidate.createdAt)}
            </div>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Easy', 'Medium', 'Hard'].map(difficulty => {
              const questions = currentCandidate.questions.filter(q => q.difficulty === difficulty);
              const totalScore = questions.reduce((sum, q) => sum + (q.score || 0), 0);
              const avgScore = questions.length > 0 ? totalScore / questions.length : 0;
              
              return (
                <div key={difficulty} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
                    <h4 className={`text-sm font-medium mb-1 ${
                      difficulty === 'Easy' ? 'text-green-600' :
                      difficulty === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {difficulty} Questions
                    </h4>
                    <div className={text-2xl font-bold ${getScoreColor(avgScore)}}>
                      {avgScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {questions.length} questions
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Summary</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
              {currentCandidate.finalSummary}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleViewDetails}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>View Detailed Report</span>
            </button>
            <button
              onClick={handleStartNew}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Start New Interview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalScore;