import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { Game, TwitchStream, YouTubeVideo, Task, WorkspaceMember } from '../types';
import { Search, Gamepad2, Radio, Video, CheckSquare, Users, X } from 'lucide-react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any, itemId?: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [streams, setStreams] = useState<TwitchStream[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const ws = store.getCurrentWorkspace();
    if (!ws) return;

    setGames(store.getGames(ws.id));
    setStreams(store.getStreams(ws.id));
    setVideos(store.getVideos(ws.id));
    setTasks(store.getTasks(ws.id));
    setMembers(store.getMembers(ws.id));
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredGames = q ? games.filter(g => g.name.toLowerCase().includes(q)) : [];
  const filteredStreams = q ? streams.filter(s => s.title.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)) : [];
  const filteredVideos = q ? videos.filter(v => v.title.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q)) : [];
  const filteredTasks = q ? tasks.filter(t => t.title.toLowerCase().includes(q)) : [];
  const filteredMembers = q ? members.filter(m => m.user?.name.toLowerCase().includes(q) || m.user?.username.toLowerCase().includes(q)) : [];

  const hasResults = filteredGames.length > 0 || filteredStreams.length > 0 || filteredVideos.length > 0 || filteredTasks.length > 0 || filteredMembers.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            placeholder="Buscar juegos, directos, vídeos, tareas o miembros..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-base focus:outline-none placeholder:text-slate-500"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="text-center py-10 text-slate-500 text-sm">
              Escribe un término de búsqueda para buscar en todo el espacio de trabajo.
            </div>
          )}

          {q && !hasResults && (
            <div className="text-center py-10 text-slate-400 text-sm">
              No se encontraron resultados para "<span className="text-white font-medium">{query}</span>".
            </div>
          )}

          {filteredGames.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                <span>Juegos</span>
              </div>
              <div className="space-y-1">
                {filteredGames.map(g => (
                  <button
                    key={g.id}
                    onClick={() => {
                      onNavigate('games');
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors"
                  >
                    <img src={g.cover_url} alt={g.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <div className="text-sm font-semibold text-white">{g.name}</div>
                      <div className="text-xs text-slate-400">Estado: {g.status} • Tipo: {g.type}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredStreams.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>Directos (Twitch)</span>
              </div>
              <div className="space-y-1">
                {filteredStreams.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onNavigate('streams');
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{s.title}</div>
                      <div className="text-xs text-slate-400">Estado: {s.status}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredVideos.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-red-400" />
                <span>Vídeos (YouTube)</span>
              </div>
              <div className="space-y-1">
                {filteredVideos.map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      onNavigate('videos');
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{v.title}</div>
                      <div className="text-xs text-slate-400">Estado: {v.status}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredTasks.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Tareas</span>
              </div>
              <div className="space-y-1">
                {filteredTasks.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onNavigate('tasks');
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.title}</div>
                      <div className="text-xs text-slate-400">Estado: {t.status}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredMembers.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Miembros</span>
              </div>
              <div className="space-y-1">
                {filteredMembers.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onNavigate('team');
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors"
                  >
                    <img src={m.user?.avatar_url} alt={m.user?.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-semibold text-white">{m.user?.name}</div>
                      <div className="text-xs text-slate-400">{m.user?.username} • Rol: {m.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
