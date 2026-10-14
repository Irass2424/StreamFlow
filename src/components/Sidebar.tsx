import React from 'react';
import { Logo } from './Logo';
import { WorkspaceSelector } from './WorkspaceSelector';
import {
  LayoutDashboard,
  Calendar,
  Radio,
  Video,
  CheckSquare,
  Gamepad2,
  Users,
  Bell,
  History,
  Settings,
  User,
  X
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'calendar'
  | 'streams'
  | 'videos'
  | 'tasks'
  | 'games'
  | 'team'
  | 'notifications'
  | 'history'
  | 'settings'
  | 'account';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadCount,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'streams', label: 'Directos', icon: Radio },
    { id: 'videos', label: 'Vídeos YouTube', icon: Video },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare },
    { id: 'games', label: 'Juegos', icon: Gamepad2 },
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'notifications', label: 'Notificaciones', icon: Bell, badge: unreadCount },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'settings', label: 'Ajustes', icon: Settings },
    { id: 'account', label: 'Mi cuenta', icon: User },
  ];

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-950 border-r border-slate-900 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-900">
          <Logo />
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-900">
          <WorkspaceSelector />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id as NavTab);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-900 bg-slate-900/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                alt="Alex Rivera"
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-800"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>
            <div className="min-w-0 text-left">
              <div className="text-sm font-semibold text-white truncate">Alex Rivera</div>
              <div className="text-xs text-slate-400 truncate">Creador / Admin</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
