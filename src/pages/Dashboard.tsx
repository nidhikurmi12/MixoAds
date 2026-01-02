import { useEffect, useState } from 'react';
import { Target, DollarSign, BarChart3, Activity } from 'lucide-react';
import { getOverallInsights } from '../services/api';
import { OverallInsights } from '../types/campaign';
import MetricCard from '../components/MetricCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const [insights, setInsights] = useState<OverallInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOverallInsights();
      setInsights(response.insights);
    } catch (err) {
      setError('Failed to load insights. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchInsights} />;
  }

  if (!insights) {
    return null;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };


  const activeRatio = insights.total_campaigns > 0
    ? (insights.active_campaigns / insights.total_campaigns) * 100
    : 0;
  const clickRatio = insights.total_impressions > 0
    ? (insights.total_clicks / insights.total_impressions) * 100 * 10
    : 0;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaign Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor your campaign performance in real-time</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Last updated</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(insights.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
        <p className="text-sm text-blue-800">
          This dashboard displays real-time campaign metrics and performance indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <MetricCard
          title="Total Campaigns"
          value={insights.total_campaigns}
          icon={BarChart3}
          progress={activeRatio}
          progressColor="#10B981"
          subtitle={`${insights.active_campaigns} active, ${insights.paused_campaigns} paused`}
        />
        <MetricCard
          title="Total Impressions"
          value={formatNumber(insights.total_impressions)}
          icon={Activity}
          progress={clickRatio}
          progressColor="#3B82F6"
        />
        <MetricCard
          title="Total Spend"
          value={formatCurrency(insights.total_spend)}
          icon={DollarSign}
          progress={Math.min((insights.total_spend / 100000) * 100, 100)}
          progressColor="#F59E0B"
        />
        <MetricCard
          title="Total Conversions"
          value={formatNumber(insights.total_conversions)}
          icon={Target}
          progress={Math.min((insights.total_conversions / 1000) * 100, 100)}
          progressColor="#10B981"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Performance Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Total Clicks
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(insights.total_clicks)}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Impressions Ratio</span>
                  <span className="font-semibold">{((insights.total_clicks / insights.total_impressions) * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(((insights.total_clicks / insights.total_impressions) * 100) * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Average CTR
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{insights.avg_ctr.toFixed(2)}%</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Target: 5%</span>
                  <span className="font-semibold">{((insights.avg_ctr / 5) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((insights.avg_ctr / 5) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Average CPC
              </p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(insights.avg_cpc)}</p>
              <p className="text-xs text-gray-500 mt-1">Cost per click</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Conversion Rate
              </p>
              <p className="text-3xl font-bold text-gray-900">{insights.avg_conversion_rate.toFixed(2)}%</p>
              <p className="text-xs text-gray-500 mt-1">Average across campaigns</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Campaign Status</h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <svg width="180" height="180" className="transform -rotate-90">
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  stroke="#E5E7EB"
                  strokeWidth="20"
                  fill="none"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  stroke="#10B981"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${(insights.active_campaigns / insights.total_campaigns) * 439.6} 439.6`}
                  strokeLinecap="round"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  stroke="#F59E0B"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${(insights.paused_campaigns / insights.total_campaigns) * 439.6} 439.6`}
                  strokeDashoffset={`-${(insights.active_campaigns / insights.total_campaigns) * 439.6}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{insights.total_campaigns}</span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{insights.active_campaigns}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Paused</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{insights.paused_campaigns}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{insights.completed_campaigns}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
