import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';

type View = 'dashboard' | 'campaigns' | 'campaign-detail';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const handleNavigate = (view: 'dashboard' | 'campaigns') => {
    setCurrentView(view);
    setSelectedCampaignId(null);
  };

  const handleSelectCampaign = (id: string) => {
    setSelectedCampaignId(id);
    setCurrentView('campaign-detail');
  };

  const handleBackToCampaigns = () => {
    setCurrentView('campaigns');
    setSelectedCampaignId(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'campaigns':
        return <Campaigns onSelectCampaign={handleSelectCampaign} />;
      case 'campaign-detail':
        return selectedCampaignId ? (
          <CampaignDetail campaignId={selectedCampaignId} onBack={handleBackToCampaigns} />
        ) : null;
      default:
        return <Dashboard />;
    }
  };

  const layoutView = currentView === 'campaign-detail' ? 'campaigns' : currentView;

  return (
    <Layout currentView={layoutView} onNavigate={handleNavigate}>
      {renderContent()}
    </Layout>
  );
}

export default App;
