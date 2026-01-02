import { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, MousePointerClick, Target, DollarSign, Radio } from 'lucide-react';
import { getCampaign, getCampaignInsights, streamCampaignInsights } from '../services/api';
import { Campaign, CampaignInsights } from '../types/campaign';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

interface CampaignDetailProps {
  campaignId: string;
  onBack: () => void;
}

export default function CampaignDetail({ campaignId, onBack }: CampaignDetailProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [insights, setInsights] = useState<CampaignInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [campaignRes, insightsRes] = await Promise.all([
        getCampaign(campaignId),
        getCampaignInsights(campaignId),
      ]);
      setCampaign(campaignRes.campaign);
      setInsights(insightsRes.insights);
    } catch (err) {
      setError('Failed to load campaign details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campaignId]);

  useEffect(() => {
    if (!isLiveUpdating) return;

    const cleanup = streamCampaignInsights(
      campaignId,
      (newInsights) => {
        setInsights(newInsights);
      },
      (error) => {
        console.error('Stream error:', error);
        setIsLiveUpdating(false);
      }
    );

    return cleanup;
  }, [campaignId, isLiveUpdating]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  if (!campaign || !insights) {
    return null;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Campaigns
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="text-gray-600 mt-1">Campaign ID: {campaign.id}</p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={campaign.status} />
            <button
              onClick={() => setIsLiveUpdating(!isLiveUpdating)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isLiveUpdating
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Radio className={`w-4 h-4 ${isLiveUpdating ? 'animate-pulse' : ''}`} />
              {isLiveUpdating ? 'Live' : 'Start Live Updates'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {formatCurrency(campaign.budget)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Daily Budget</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {formatCurrency(campaign.daily_budget)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Platforms</p>
            <div className="flex gap-1 mt-1">
              {campaign.platforms.map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {new Date(campaign.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Impressions"
            value={formatNumber(insights.impressions)}
            icon={TrendingUp}
          />
          <MetricCard
            title="Clicks"
            value={formatNumber(insights.clicks)}
            icon={MousePointerClick}
          />
          <MetricCard
            title="Conversions"
            value={formatNumber(insights.conversions)}
            icon={Target}
          />
          <MetricCard title="Spend" value={formatCurrency(insights.spend)} icon={DollarSign} />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Click-Through Rate (CTR)</h3>
            <p className="text-3xl font-bold text-gray-900">{insights.ctr.toFixed(2)}%</p>
            <p className="text-sm text-gray-500 mt-2">
              {insights.clicks} clicks / {insights.impressions} impressions
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Cost Per Click (CPC)</h3>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(insights.cpc)}</p>
            <p className="text-sm text-gray-500 mt-2">
              {formatCurrency(insights.spend)} / {insights.clicks} clicks
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-gray-900">{insights.conversion_rate.toFixed(2)}%</p>
            <p className="text-sm text-gray-500 mt-2">
              {insights.conversions} conversions / {insights.clicks} clicks
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Last updated: {new Date(insights.timestamp).toLocaleString()}
          {isLiveUpdating && <span className="ml-2 font-medium">(Updating in real-time)</span>}
        </p>
      </div>
    </div>
  );
}
