import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Send, Clock, AlertTriangle } from 'lucide-react';
import { RootState } from '../../store';
import { 
  submitAnswer, 
  evaluateAnswer, 
  nextQuestion, 
  generateFinalSummary, 
  completeInterview,
  stopQuestion 
} from '../../store/slices/interviewSlice';
import { addCandidate } from '../../store/slices/candidatesSlice';
import Timer from '../common/Timer';

const QuestionCard: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    currentCandidate, 
    currentQuestionIndex, 
    timeRemaining, 
    isQuestionActive 
  } = useSelector((state: RootState) => state.interview);

  const [answer, setAnswer] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = currentCandidate?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (currentCandidate?.questions.length ?? 0) - 1;

  useEffect(() => {
    if (isQuestionActive && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [isQuestionActive, startTime]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && isQuestionActive && currentQuestion && !currentQuestion.answer) {
      handleSubmit();
    }
  }, [timeRemaining, isQuestionActive, currentQuestion]);

  const handleSubmit = async () => {
    if (!currentQuestion || !currentCandidate || isSubmitting) return;
    
    setIsSubmitting(true);
    dispatch(stopQuestion());

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const finalAnswer = answer.trim() || 'No answer provided (time ran out)';

    // Submit the answer
    dispatch(submitAnswer({ 
      answer: finalAnswer, 
      timeSpent: timeSpent 
    }));

    try {
      // Evaluate the answer
      await dispatch(evaluateAnswer({
        question: currentQuestion.question,
        answer: finalAnswer,
        timeSpent: timeSpent
      })).unwrap();

      // Save to candidates store
      dispatch(addCandidate(currentCandidate));

      if (isLastQuestion) {
        // Generate final summary and complete interview
        await dispatch(generateFinalSummary(currentCandidate.questions)).unwrap();
        dispatch(completeInterview());
        dispatch(addCandidate(currentCandidate)); // Save final state
      } else {
        // Move to next question
        setTimeout(() => {
          dispatch(nextQuestion());
          setAnswer('');
          setStartTime(0);
        }, 2000); // Brief delay to show feedback
      }
    } catch (error) {
      console.error('Failed to evaluate answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion || !currentCandidate) {
    return null;
  }

  const hasAnswer = !!currentQuestion.answer;
  const showFeedback = hasAnswer && currentQuestion.feedback;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {currentCandidate.questions.length}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              currentQuestion.difficulty === 'Easy' 
                ? 'bg-green-100 text-green-800'
                : currentQuestion.difficulty === 'Medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: ${((currentQuestionIndex + (hasAnswer ? 1 : 0)) / currentCandidate.questions.length) * 100}% }}
            />
          </div>
        </div>

        {/* Timer */}
        {isQuestionActive && <div className="mb-6"><Timer /></div>}

        {/* Question */}
        <div className="mb-6">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Interview Question
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>
          </div>
        </div>

        {/* Answer Input */}
        {!hasAnswer ? (
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={!isQuestionActive || isSubmitting}
            />
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">
                {answer.length} characters
              </span>
              
              <button
                onClick={handleSubmit}
                disabled={!isQuestionActive || isSubmitting || !answer.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Show submitted answer and feedback */
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Your Answer:</h4>
              <p className="text-gray-700">{currentQuestion.answer}</p>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Time spent: {currentQuestion.timeSpent}s</span>
                  <span>•</span>
                  <span>Length: {currentQuestion.answer?.length} characters</span>
                </div>
                {currentQuestion.score !== undefined && (
                  <div className={`font-semibold ${
                    currentQuestion.score >= 8 ? 'text-green-600' :
                    currentQuestion.score >= 6 ? 'text-yellow-600' :
                    currentQuestion.score >= 4 ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    Score: {currentQuestion.score}/10
                  </div>
                )}
              </div>
            </div>

            {showFeedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">AI Feedback:</h4>
                <p className="text-blue-800">{currentQuestion.feedback}</p>
              </div>
            )}

            {!isLastQuestion && (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Moving to next question...</p>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto" />
              </div>
            )}
          </div>
        )}

        {/* Warning for time running out */}
        {isQuestionActive && timeRemaining <= 30 && timeRemaining > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-yellow-800 font-medium">Time running out!</p>
              <p className="text-yellow-700 text-sm">
                Submit your answer before the timer reaches zero.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;