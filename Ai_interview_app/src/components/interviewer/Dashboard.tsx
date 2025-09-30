import React from 'react';
import { useSelector } from 'react-redux';
import { Users, Trophy, Clock, CheckCircle } from 'lucide-react';
import { RootState } from '../../store';
import SearchSort from './SearchSort';
import CandidateList from './CandidateList';
import CandidateDetails from './CandidateDetails';

const Dashboard: React.FC = () => {
  const { candidates } = useSelector((state: RootState) => state.candidates);
  const { showCandidateDetails } = useSelector((state: RootState) => state.ui);

  if (showCandidateDetails) {
    return <CandidateDetails />;
  }

  const completedCandidates = candidates.filter(c => c.status === 'completed');
  const inProgressCandidates = candidates.filter(c => c.status === 'in-progress');
  const averageScore = completedCandidates.length > 0 
    ? completedCandidates.reduce((sum, c) => sum + c.finalScore, 0) / completedCandidates.length 
    : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Dashboard</h1>
        <p className="text-gray-600">Manage and review all candidate interviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-2xl font-semibold text-gray-900">{candidates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedCandidates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{inProgressCandidates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {averageScore > 0 ? averageScore.toFixed(1) : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort */}
      <SearchSort />

      {/* Candidates List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Candidates</h2>
          <span className="text-sm text-gray-500">
            {candidates.length} total candidates
          </span>
        </div>
        <CandidateList />
      </div>
    </div>
  );
};

export default Dashboard;