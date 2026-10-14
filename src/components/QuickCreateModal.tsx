import React, { useState } from 'react';
import { store } from '../services/store';
import { Radio, Video, Gamepad2, CheckSquare, UserPlus, X } from 'lucide-react';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any) => void;
}

type QuickType = 'stream' | 'video' | 'game' | 'task' | 'invite';

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [type, setType] = useState<QuickType>('stream');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledStart, setScheduledStart] = useState('');
  const [gameType, setGameType] = useState<'series' | 'standalone' | 'continuous'>('series');
  const [inviteUsername, setInviteUsername] = useState('');

  if (!isOpen) return null;

  const ws = store.getCurrentWorkspace();
  const currentUser = store.getCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws) return;

    if (type === 'stream') {
      store.addStream({
        id: 'stream_' + Date.now(),
        workspace_id: ws.id,
        title: title.trim() || 'Nuevo Directo de Twitch',
        description: description.trim(),
        scheduled_start: scheduledStart ? new Date(scheduledStart).toISOString() : new Date(Date.now() + 3600000).toISOString(),
        participant_user_ids: [currentUser.id],
        status: 'scheduled',
        created_at: new Date().toISOString()
      });
      store.logActivity({
        id: 'log_' + Date.now(),
        workspace_id: ws.id,
        action: `Rápido: Directo creado "${title}"`,
        user_name: `${currentUser.name} (${currentUser.username})`,
        is_system: false,
        affected_entity: 'Directos',
        created_at: new Date().toISOString()
      });
      onNavigate('streams');
    } else if (type === 'video') {
      store.addVideo({
        id: 'vid_' + Date.now(),
        workspace_id: ws.id,
        title: title.trim() || 'Nuevo Vídeo de YouTube',
        description: description.trim(),
        scheduled_publish: scheduledStart ? new Date(scheduledStart).toISOString() : new Date(Date.now() + 86400000).toISOString(),
        thumbnail_completed: false,
        editing_completed: false,
        status: 'pending',
        created_at: new Date().toISOString()
      });
      store.logActivity({
        id: 'log_' + Date.now(),
        workspace_id: ws.id,
        action: `Rápido: Vídeo creado "${title}"`,
        user_name: `${currentUser.name} (${currentUser.username})`,
        is_system: false,
        affected_entity: 'Vídeos YouTube',
        created_at: new Date().toISOString()
      });
      onNavigate('videos');
    } else if (type === 'game') {
      store.addGame({
        id: 'game_' + Date.now(),
        workspace_id: ws.id,
        name: title.trim() || 'Nuevo Juego',
        cover_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
        status: 'playing',
        type: gameType,
        current_chapter: gameType === 'series' ? 1 : undefined,
        next_chapter_suggested: gameType === 'series' ? 2 : undefined,
        notes: description.trim(),
        created_at: new Date().toISOString()
      });
      onNavigate('games');
    } else if (type === 'task') {
      store.addTask({
        id: 'task_' + Date.now(),
        workspace_id: ws.id,
        title: title.trim() || 'Nueva Tarea',
        assigned_user_id: currentUser.id,
        status: 'pending',
        type: 'general',
        due_date: scheduledStart ? new Date(scheduledStart).toISOString() : undefined,
        created_at: new Date().toISOString()
      });
      onNavigate('tasks');
    } else if (type === 'invite') {
      store.addInvitation({
        id: 'inv_' + Date.now(),
        workspace_id: ws.id,
        invited_username: inviteUsername.startsWith('@') ? inviteUsername : `@${inviteUsername}`,
        invited_by_user_id: currentUser.id,
        role: 'editor',
        status: 'pending',
        created_at: new Date().toISOString()
      });
      onNavigate('team');
    }

    setTitle('');
    setDescription('');
    setScheduledStart('');
    setInviteUsername('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white">Creación Rápida</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-950 rounded-xl">
          {[
            { id: 'stream', label: 'Directo', icon: Radio },
            { id: 'video', label: 'Vídeo', icon: Video },
            { id: 'game', label: 'Juego', icon: Gamepad2 },
            { id: 'task', label: 'Tarea', icon: CheckSquare },
            { id: 'invite', label: 'Invitar', icon: UserPlus },
          ].map(item => {
            const Icon = item.icon;
            const isActive = type === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id as QuickType)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type !== 'invite' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Título / Nombre *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    type === 'stream' ? 'ej. Sons of the Forest Cap 4' :
                    type === 'video' ? 'ej. Resumen del Directo Cap 4' :
                    type === 'game' ? 'ej. Elden Ring' : 'ej. Diseñar miniatura'
                  }
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              {(type === 'stream' || type === 'video' || type === 'task') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Fecha y hora prevista
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledStart}
                    onChange={e => setScheduledStart(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {type === 'game' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tipo de Juego
                  </label>
                  <select
                    value={gameType}
                    onChange={e => setGameType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="series">Serie por Capítulos (e.g. Sons of the Forest)</option>
                    <option value="standalone">Juego Completo (1 directo/vídeo)</option>
                    <option value="continuous">Sin Capítulos (e.g. Minecraft)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Notas / Descripción (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nombre de usuario StreamFlow *
              </label>
              <input
                type="text"
                required
                placeholder="@usuario"
                value={inviteUsername}
                onChange={e => setInviteUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-xl gradient-brand text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
