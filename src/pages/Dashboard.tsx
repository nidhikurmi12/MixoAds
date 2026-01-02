import { useEffect, useState } from 'react';
import { TrendingUp, MousePointerClick, Target, DollarSign, BarChart3, Activity } from 'lucide-react';
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campaign Overview</h1>
        <p className="text-gray-600 mt-2">Monitor your campaign performance in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Campaigns"
          value={insights.total_campaigns}
          icon={BarChart3}
          subtitle={`${insights.active_campaigns} active, ${insights.paused_campaigns} paused, ${insights.completed_campaigns} completed`}
        />
        <MetricCard
          title="Total Impressions"
          value={formatNumber(insights.total_impressions)}
          icon={Activity}
        />
        <MetricCard
          title="Total Clicks"
          value={formatNumber(insights.total_clicks)}
          icon={MousePointerClick}
        />
        <MetricCard
          title="Total Conversions"
          value={formatNumber(insights.total_conversions)}
          icon={Target}
        />
        <MetricCard
          title="Total Spend"
          value={formatCurrency(insights.total_spend)}
          icon={DollarSign}
        />
        <MetricCard
          title="Average CTR"
          value={`${insights.avg_ctr.toFixed(2)}%`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Average CPC</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(insights.avg_cpc)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Average Conversion Rate</h3>
          <p className="text-2xl font-bold text-gray-900">{insights.avg_conversion_rate.toFixed(2)}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Last Updated</h3>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(insights.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
