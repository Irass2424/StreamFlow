import { useState, useEffect } from 'react';
import { Sidebar, type NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { GlobalSearch } from './components/GlobalSearch';
import { QuickCreateModal } from './components/QuickCreateModal';

import { Dashboard } from './pages/Dashboard';
import { CalendarView } from './pages/CalendarView';
import { StreamsView } from './pages/StreamsView';
import { VideosView } from './pages/VideosView';
import { TasksView } from './pages/TasksView';
import { GamesView } from './pages/GamesView';
import { GameDetail } from './pages/GameDetail';
import { TeamView } from './pages/TeamView';
import { NotificationsView } from './pages/NotificationsView';
import { HistoryView } from './pages/HistoryView';
import { WorkspaceSettingsView } from './pages/WorkspaceSettingsView';
import { AccountView } from './pages/AccountView';

import { store } from './services/store';
import { automationEngine } from './services/automationEngine';
import type { Notification } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  useEffect(() => {
    automationEngine.start();

    const updateUnread = () => {
      const ws = store.getCurrentWorkspace();
      const user = store.getCurrentUser();
      if (ws && user) {
        const notifs = store.getNotifications(ws.id, user.id);
        setUnreadCount(notifs.filter((n: Notification) => !n.read).length);
      }
    };

    updateUnread();
    const unsub = store.subscribe(updateUnread);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      automationEngine.stop();
      unsub();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    setSelectedGameId(null);
  };

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex">
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        unreadCount={unreadCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          unreadCount={unreadCount}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenQuickCreate={() => setIsQuickCreateOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && <Dashboard onNavigate={handleSelectTab} />}
          {currentTab === 'calendar' && <CalendarView onNavigate={handleSelectTab} />}
          {currentTab === 'streams' && <StreamsView />}
          {currentTab === 'videos' && <VideosView />}
          {currentTab === 'tasks' && <TasksView />}

          {currentTab === 'games' && (
            selectedGameId ? (
              <GameDetail
                gameId={selectedGameId}
                onBack={() => setSelectedGameId(null)}
                onNavigate={handleSelectTab}
              />
            ) : (
              <GamesView onSelectGame={handleSelectGame} />
            )
          )}

          {currentTab === 'team' && <TeamView />}
          {currentTab === 'notifications' && <NotificationsView />}
          {currentTab === 'history' && <HistoryView />}
          {currentTab === 'settings' && <WorkspaceSettingsView />}
          {currentTab === 'account' && <AccountView />}
        </main>
      </div>

      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleSelectTab}
      />

      <QuickCreateModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
        onNavigate={handleSelectTab}
      />
    </div>
  );
}

export default App;
