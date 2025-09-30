import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, MessageSquare } from 'lucide-react';
import { RootState } from '../../store';
import { setActiveTab } from '../../store/slices/uiSlice';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.ui.activeTab);

  const handleTabChange = (tab: 'interviewee' | 'interviewer') => {
    dispatch(setActiveTab(tab));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                AI Interview Assistant
              </h1>
            </div>
            
            {/* Tab Navigation */}
            <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleTabChange('interviewee')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'interviewee'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Interview</span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange('interviewer')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'interviewer'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;