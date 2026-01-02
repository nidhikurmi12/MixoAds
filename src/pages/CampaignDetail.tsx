import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, MousePointerClick, Target, DollarSign, Radio } from 'lucide-react';
import { getCampaign, getCampaignInsights, streamCampaignInsights } from '../services/api';
import { Campaign, CampaignInsights } from '../types/campaign';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

interface CampaignDetailProps {
  campaignId: string;
}

export default function CampaignDetail({ campaignId }: CampaignDetailProps) {
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
      <Link
        to="/campaigns"
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors hover:gap-3 gap-2"
      >
        <span>←</span>
        Back to Campaigns
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="text-sm text-gray-500 mt-1">ID: {campaign.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={campaign.status} />
            <button
              onClick={() => setIsLiveUpdating(!isLiveUpdating)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isLiveUpdating
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Radio className={`w-4 h-4 ${isLiveUpdating ? 'animate-pulse' : ''}`} />
              {isLiveUpdating ? 'Live Updates' : 'Enable Live'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Budget</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(campaign.budget)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Daily Budget</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(campaign.daily_budget)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Platforms</p>
            <div className="flex gap-1.5 mt-1 flex-wrap">
              {campaign.platforms.map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Created</p>
            <p className="text-xl font-bold text-gray-900">
              {new Date(campaign.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Impressions"
            value={formatNumber(insights.impressions)}
            icon={TrendingUp}
            progress={Math.min((insights.impressions / 10000) * 100, 100)}
            progressColor="#3B82F6"
          />
          <MetricCard
            title="Clicks"
            value={formatNumber(insights.clicks)}
            icon={MousePointerClick}
            progress={Math.min((insights.clicks / 1000) * 100, 100)}
            progressColor="#10B981"
          />
          <MetricCard
            title="Conversions"
            value={formatNumber(insights.conversions)}
            icon={Target}
            progress={Math.min((insights.conversions / 100) * 100, 100)}
            progressColor="#F59E0B"
          />
          <MetricCard
            title="Spend"
            value={formatCurrency(insights.spend)}
            icon={DollarSign}
            progress={Math.min((insights.spend / campaign.budget) * 100, 100)}
            progressColor="#EF4444"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Click-Through Rate</h3>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-3">{insights.ctr.toFixed(2)}%</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Clicks</span>
                <span className="font-medium">{formatNumber(insights.clicks)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Impressions</span>
                <span className="font-medium">{formatNumber(insights.impressions)}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost Per Click</h3>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-3">{formatCurrency(insights.cpc)}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Total Spend</span>
                <span className="font-medium">{formatCurrency(insights.spend)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Total Clicks</span>
                <span className="font-medium">{formatNumber(insights.clicks)}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversion Rate</h3>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-3">{insights.conversion_rate.toFixed(2)}%</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Conversions</span>
                <span className="font-medium">{formatNumber(insights.conversions)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Total Clicks</span>
                <span className="font-medium">{formatNumber(insights.clicks)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Last updated:</span> {new Date(insights.timestamp).toLocaleString()}
          </p>
          {isLiveUpdating && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Updates Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
