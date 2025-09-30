import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Mail, Phone, Calendar, FileText, Clock, MessageSquare } from 'lucide-react';
import { RootState } from '../../store';
import { setShowCandidateDetails } from '../../store/slices/uiSlice';
import { formatDate, getScoreColor, getScoreBadgeColor } from '../../utils/helpers';

const CandidateDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedCandidate } = useSelector((state: RootState) => state.candidates);
  const { candidates } = useSelector((state: RootState) => state.candidates);
  
  const candidate = candidates.find(c => c.id === selectedCandidate);

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Candidate not found.</p>
      </div>
    );
  }

  const handleBack = () => {
    dispatch(setShowCandidateDetails(false));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleBack}
          className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Interview Details</h1>
      </div>

      {/* Candidate Info */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {candidate.name}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(candidate.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {candidate.status === 'completed' && (
            <div className="text-center">
              <div className={text-4xl font-bold mb-2 ${getScoreColor(candidate.finalScore)}}>
                {candidate.finalScore}/10
              </div>
              <div className={inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBadgeColor(candidate.finalScore)}}>
                {candidate.finalScore >= 8 ? 'Excellent' :
                 candidate.finalScore >= 6 ? 'Good' :
                 candidate.finalScore >= 4 ? 'Fair' : 'Needs Improvement'}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Resume Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>File:</strong> {candidate.resumeFileName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Content Preview:</strong>
              </p>
              <div className="mt-2 p-3 bg-white rounded border text-xs text-gray-700 max-h-32 overflow-y-auto">
                {candidate.resumeText.substring(0, 300)}...
              </div>
            </div>
          </div>

          {candidate.status === 'completed' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Score Breakdown
              </h3>
              <div className="space-y-3">
                {['Easy', 'Medium', 'Hard'].map((difficulty) => {
                  const questions = candidate.questions.filter(q => q.difficulty === difficulty);
                  const totalScore = questions.reduce((sum, q) => sum + (q.score || 0), 0);
                  const avgScore = questions.length > 0 ? totalScore / questions.length : 0;
                  
                  return (
                    <div key={difficulty} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className={`font-medium ${
                        difficulty === 'Easy' ? 'text-green-600' :
                        difficulty === 'Medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {difficulty} Questions ({questions.length})
                      </span>
                      <span className={font-bold ${getScoreColor(avgScore)}}>
                        {avgScore.toFixed(1)}/10
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Questions & Answers */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Interview Questions & Answers
        </h3>
        
        <div className="space-y-6">
          {candidate.questions.map((question, index) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                    Q{index + 1}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    question.difficulty === 'Easy' 
                      ? 'bg-green-100 text-green-800'
                      : question.difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty} • {question.timeLimit}s
                  </span>
                </div>
                
                {question.score !== undefined && (
                  <div className={font-bold ${getScoreColor(question.score)}}>
                    {question.score}/10
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                <p className="text-gray-700">{question.question}</p>
              </div>

              {question.answer && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Answer:</h4>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-gray-700 whitespace-pre-wrap">{question.answer}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Time spent: {question.timeSpent}s</span>
                    </div>
                    <span>•</span>
                    <span>Length: {question.answer.length} characters</span>
                    {question.answeredAt && (
                      <>
                        <span>•</span>
                        <span>Answered: {formatDate(question.answeredAt)}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {question.feedback && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <h4 className="font-medium text-blue-900 mb-2">AI Feedback:</h4>
                  <p className="text-blue-800 text-sm">{question.feedback}</p>
                </div>
              )}

              {!question.answer && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-yellow-800 text-sm">This question was not answered.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final Summary */}
      {candidate.status === 'completed' && candidate.finalSummary && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            AI Final Assessment
          </h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
              {candidate.finalSummary}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetails;