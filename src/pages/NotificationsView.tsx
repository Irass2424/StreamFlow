import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { Notification } from '../types';
import { Bell, CheckCircle2, AlertTriangle, Radio, Video, CheckSquare, Mail, Info } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const updateData = () => {
      const ws = store.getCurrentWorkspace();
      const currentUser = store.getCurrentUser();
      if (ws && currentUser) {
        setNotifications(store.getNotifications(ws.id, currentUser.id));
      }
    };
    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, []);

  const handleMarkRead = (id: string) => {
    store.markNotificationAsRead(id);
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'video_delayed':
      case 'integration_error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'stream_started':
      case 'stream_ended':
      case 'stream_reminder':
        return <Radio className="w-5 h-5 text-purple-400" />;
      case 'video_ready':
      case 'video_published':
        return <Video className="w-5 h-5 text-red-400" />;
      case 'task_assigned':
      case 'task_completed':
        return <CheckSquare className="w-5 h-5 text-emerald-400" />;
      case 'invitation':
        return <Mail className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Centro de Notificaciones</h2>
            <p className="text-xs text-slate-400">
              Avisos de tareas, cambios en eventos, alertas de retrasos e invitaciones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unread' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Sin leer ({notifications.filter(n => !n.read).length})
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3 shadow-xl">
        {filtered.length > 0 ? (
          filtered.map(notif => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                !notif.read
                  ? 'bg-slate-950 border-cyan-500/30 ring-1 ring-cyan-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{notif.message}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {new Date(notif.created_at).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-400 hover:bg-slate-800 flex items-center gap-1 whitespace-nowrap"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Marcar leída</span>
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm">
            No tienes notificaciones en esta categoría.
          </div>
        )}
      </div>
    </div>
  );
};
