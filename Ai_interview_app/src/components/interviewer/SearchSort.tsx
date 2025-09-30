import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Import as SortAsc, Dessert as SortDesc } from 'lucide-react';
import { RootState } from '../../store';
import { setSearchTerm, setSortBy, setSortOrder } from '../../store/slices/candidatesSlice';

const SearchSort: React.FC = () => {
  const dispatch = useDispatch();
  const { searchTerm, sortBy, sortOrder } = useSelector((state: RootState) => state.candidates);

  const handleSortChange = (newSortBy: 'name' | 'score' | 'date') => {
    if (sortBy === newSortBy) {
      // Toggle order if same sort field
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set new sort field with default order
      dispatch(setSortBy(newSortBy));
      dispatch(setSortOrder(newSortBy === 'name' ? 'asc' : 'desc'));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            placeholder="Search candidates by name or email..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex space-x-1">
            {[
              { key: 'name', label: 'Name' },
              { key: 'score', label: 'Score' },
              { key: 'date', label: 'Date' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSortChange(key as 'name' | 'score' | 'date')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  sortBy === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{label}</span>
                {sortBy === key && (
                  sortOrder === 'asc' ? 
                    <SortAsc className="w-4 h-4" /> : 
                    <SortDesc className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSort;