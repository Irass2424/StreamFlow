import React, { useState, useEffect } from 'react';
import type { NavTab } from './Sidebar';
import { store } from '../services/store';
import { Search, Plus, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadCount: number;
  onOpenMobileSidebar: () => void;
  onOpenQuickCreate: () => void;
  onOpenSearch: () => void;
}

const TAB_TITLES: Record<NavTab, string> = {
  dashboard: 'Dashboard General',
  calendar: 'Calendario de Contenidos',
  streams: 'Gestión de Directos (Twitch)',
  videos: 'Vídeos de YouTube',
  tasks: 'Gestión de Tareas',
  games: 'Biblioteca de Juegos',
  team: 'Equipo y Permisos',
  notifications: 'Centro de Notificaciones',
  history: 'Historial de Actividad',
  settings: 'Ajustes del Espacio',
  account: 'Mi Cuenta'
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  unreadCount,
  onOpenMobileSidebar,
  onOpenQuickCreate,
  onOpenSearch
}) => {
  const [currentUser, setCurrentUser] = useState(store.getCurrentUser());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
    });
    return unsub;
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight">
          {TAB_TITLES[currentTab]}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-sm hover:border-slate-700 hover:text-slate-200 transition-all w-64"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span className="truncate">Buscar en el espacio de trabajo...</span>
          <kbd className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">⌘K</kbd>
        </button>

        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenQuickCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl gradient-brand text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Crear rápido</span>
        </button>

        <button
          onClick={() => onSelectTab('notifications')}
          className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-950">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('account')}
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-900 transition-colors"
        >
          <img
            src={currentUser.avatar_url}
            alt={currentUser.name}
            className="w-8 h-8 rounded-xl object-cover ring-2 ring-slate-800"
          />
        </button>
      </div>
    </header>
  );
};
