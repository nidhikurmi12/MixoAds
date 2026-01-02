import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';

type NavView = 'dashboard' | 'campaigns';

function CampaignDetailWrapper({ onBack }: { onBack: () => void }) {
  const { id } = useParams();
  if (!id) return null;
  return <CampaignDetail campaignId={id} onBack={onBack} />;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const onNavigate = (view: NavView) => {
    if (view === 'dashboard') navigate('/');
    else navigate('/campaigns');
  };

  const onSelectCampaign = (id: string) => {
    navigate(`/campaigns/${id}`);
  };

  const onBackToCampaigns = () => navigate('/campaigns');

  const layoutView: NavView = location.pathname.startsWith('/campaigns') ? 'campaigns' : 'dashboard';

  return (
    <Layout currentView={layoutView} onNavigate={onNavigate}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campaigns" element={<Campaigns onSelectCampaign={onSelectCampaign} />} />
        <Route path="/campaigns/:id" element={<CampaignDetailWrapper onBack={onBackToCampaigns} />} />
      </Routes>
    </Layout>
  );
}
