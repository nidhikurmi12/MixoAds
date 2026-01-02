import {
  BarChart3,
  Megaphone,
  Search,
  Bell,
  Settings,
  Grid3x3,
  Menu,
  X,
} from "lucide-react";
import { ReactNode, useState } from "react";

interface LayoutProps {
  children: ReactNode;
  currentView: "dashboard" | "campaigns";
  onNavigate: (view: "dashboard" | "campaigns") => void;
}

export default function Layout({
  children,
  currentView,
  onNavigate,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static z-50 h-full bg-white border-r border-gray-200
          transform transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 w-64`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">
                  Mixo Ads
                </span>
              </div>

              {/* Close button (mobile) */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Menu
              </p>

              <button
                onClick={() => {
                  onNavigate("dashboard");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium
                ${
                  currentView === "dashboard"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Dashboard
              </button>

              <button
                onClick={() => {
                  onNavigate("campaigns");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium
                ${
                  currentView === "campaigns"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Megaphone className="w-5 h-5 mr-3" />
                Campaigns
              </button>

              <div className="pt-6">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Views
                </p>
                <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Grid3x3 className="w-5 h-5 mr-3" />
                  Analytics
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Search */}
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
