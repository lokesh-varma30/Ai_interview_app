import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { RootState } from '../../store';
import { setShowWelcomeBack, startInterview } from '../../store/slices/interviewSlice';
import { formatDate } from '../../utils/helpers';

const WelcomeBackModal: React.FC = () => {
  const dispatch = useDispatch();
  const { showWelcomeBack, currentCandidate, currentQuestionIndex } = useSelector(
    (state: RootState) => state.interview
  );

  if (!showWelcomeBack || !currentCandidate) {
    return null;
  }

  const handleContinue = () => {
    dispatch(setShowWelcomeBack(false));
    dispatch(startInterview());
  };

  const handleStartOver = () => {
    dispatch(setShowWelcomeBack(false));
    // This would reset the interview - implement if needed
  };

  const progress = ((currentQuestionIndex) / currentCandidate.questions.length) * 100;
  const answeredCount = currentCandidate.questions.filter(q => q.answer).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">
            We found your previous interview session
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">{currentCandidate.name}</p>
              <p className="text-sm text-gray-500">{currentCandidate.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress:</span>
              <span className="font-medium">
                {answeredCount} of {currentCandidate.questions.length} questions answered
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: ${progress}% }}
              />
            </div>
            
            <p className="text-xs text-gray-500">
              Started: {formatDate(currentCandidate.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleStartOver}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Start Over
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBackModal;