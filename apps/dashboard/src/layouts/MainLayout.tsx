import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, MousePointerClick } from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight">ShopAnalytics</h1>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          <NavLink
            to="/sessions"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <LayoutDashboard size={20} />
            Sessions
          </NavLink>
          <NavLink
            to="/heatmap"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <MousePointerClick size={20} />
            Heatmap
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Admin</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-slate-50 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
