import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import Layout from './components/common/Layout';
import IntervieweeFlow from './components/IntervieweeFlow';
import InterviewerFlow from './components/InterviewerFlow';
import WelcomeBackModal from './components/common/WelcomeBackModal';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const AppContent: React.FC = () => {
  const activeTab = useSelector((state: RootState) => state.ui.activeTab);

  return (
    <Layout>
      {activeTab === 'interviewee' ? <IntervieweeFlow /> : <InterviewerFlow />}
      <WelcomeBackModal />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;