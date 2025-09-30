import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Calendar, Mail, Phone, Trash2 } from 'lucide-react';
import { RootState } from '../../store';
import { selectCandidate, deleteCandidateById } from '../../store/slices/candidatesSlice';
import { setShowCandidateDetails } from '../../store/slices/uiSlice';
import { formatDate, getScoreColor, getScoreBadgeColor } from '../../utils/helpers';

const CandidateList: React.FC = () => {
  const dispatch = useDispatch();
  const { candidates, searchTerm, sortBy, sortOrder } = useSelector(
    (state: RootState) => state.candidates
  );

  // Filter and sort candidates
  const filteredAndSortedCandidates = React.useMemo(() => {
    let filtered = candidates.filter((candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'score':
          aValue = a.finalScore;
          bValue = b.finalScore;
          break;
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [candidates, searchTerm, sortBy, sortOrder]);

  const handleViewDetails = (candidateId: string) => {
    dispatch(selectCandidate(candidateId));
    dispatch(setShowCandidateDetails(true));
  };

  const handleDeleteCandidate = (candidateId: string) => {
    if (window.confirm('Are you sure you want to delete this candidate? This action cannot be undone.')) {
      dispatch(deleteCandidateById(candidateId));
    }
  };

  if (filteredAndSortedCandidates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchTerm ? 'No candidates found' : 'No candidates yet'}
        </h3>
        <p className="text-gray-500">
          {searchTerm 
            ? 'Try adjusting your search criteria.'
            : 'Candidates will appear here after completing interviews.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAndSortedCandidates.map((candidate) => (
        <div
          key={candidate.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {candidate.name}
                </h3>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  candidate.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {candidate.status === 'completed' ? 'Completed' : 'In Progress'}
                </div>
                {candidate.status === 'completed' && (
                  <div className={text-2xl font-bold ${getScoreColor(candidate.finalScore)}}>
                    {candidate.finalScore}/10
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{candidate.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(candidate.createdAt)}</span>
                </div>
              </div>

              {candidate.status === 'completed' && (
                <div className="mb-4">
                  <div className="grid grid-cols-3 gap-4">
                    {['Easy', 'Medium', 'Hard'].map((difficulty) => {
                      const questions = candidate.questions.filter(q => q.difficulty === difficulty);
                      const avgScore = questions.reduce((sum, q) => sum + (q.score || 0), 0) / questions.length;
                      
                      return (
                        <div key={difficulty} className="text-center">
                          <div className={`text-xs font-medium mb-1 ${
                            difficulty === 'Easy' ? 'text-green-600' :
                            difficulty === 'Medium' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {difficulty}
                          </div>
                          <div className={text-sm font-semibold ${getScoreColor(avgScore)}}>
                            {avgScore.toFixed(1)}/10
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <span className="font-medium">Resume:</span> {candidate.resumeFileName}
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => handleViewDetails(candidate.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                onClick={() => handleDeleteCandidate(candidate.id)}
                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateList;