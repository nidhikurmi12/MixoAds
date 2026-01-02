import { BarChart3, Megaphone } from 'lucide-react';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentView: 'dashboard' | 'campaigns';
  onNavigate: (view: 'dashboard' | 'campaigns') => void;
}

export default function Layout({ children, currentView, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Megaphone className="w-8 h-8 text-blue-600" />
              <span className="ml-3 text-xl font-bold text-gray-900">Mixo Ads</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('campaigns')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'campaigns'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Megaphone className="w-5 h-5 mr-2" />
                Campaigns
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
