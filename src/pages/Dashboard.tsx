import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { TwitchStream, YouTubeVideo, Task, Game } from '../types';
import { Radio, Video, CheckSquare, Clock, AlertTriangle, Play, Calendar as CalendarIcon } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [streams, setStreams] = useState<TwitchStream[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [currentUser] = useState(store.getCurrentUser());

  useEffect(() => {
    const updateData = () => {
      const currentWs = store.getCurrentWorkspace();
      if (currentWs) {
        setStreams(store.getStreams(currentWs.id));
        setVideos(store.getVideos(currentWs.id));
        setTasks(store.getTasks(currentWs.id));
        setGames(store.getGames(currentWs.id));
      }
    };

    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, []);

  const nextStream = streams
    .filter(s => ['scheduled', 'preparing', 'live'].includes(s.status))
    .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime())[0];

  const upcomingVideos = videos
    .filter(v => ['pending', 'in_preparation', 'ready_to_upload', 'uploaded', 'scheduled'].includes(v.status))
    .sort((a, b) => new Date(a.scheduled_publish).getTime() - new Date(b.scheduled_publish).getTime())
    .slice(0, 3);

  const delayedVideos = videos.filter(v => v.status === 'delayed');
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const myTasks = tasks.filter(t => t.assigned_user_id === currentUser.id && t.status !== 'completed');

  const getGameName = (gameId?: string) => {
    if (!gameId) return 'Juego no especificado';
    return games.find(g => g.id === gameId)?.name || 'Juego no especificado';
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {nextStream?.status === 'live' && (
          <div className="absolute top-0 right-0 bg-red-600 text-white font-black text-xs px-4 py-1.5 rounded-bl-xl uppercase tracking-widest flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" /> EN DIRECTO
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                Twitch Stream
              </span>
              {nextStream && (
                <span className="text-xs text-slate-400 font-medium">
                  {getGameName(nextStream.game_id)}
                </span>
              )}
            </div>

            {nextStream ? (
              <div>
                <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">
                  {nextStream.title}
                </h2>
                {nextStream.description && (
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {nextStream.description}
                  </p>
                )}
              </div>
            ) : (
              <h2 className="text-xl font-bold text-slate-400">
                No hay directos programados actualmente.
              </h2>
            )}

            {nextStream && (
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>
                    {new Date(nextStream.scheduled_start).toLocaleString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Estado:</span>
                  <span className="font-semibold text-amber-400 uppercase">
                    {nextStream.status === 'preparing' ? '🟡 PREPARANDO' : nextStream.status === 'live' ? '🔴 EN DIRECTO' : '🗓️ PROGRAMADO'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {nextStream && (
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 min-w-[200px]">
              <button
                onClick={() => onNavigate('streams')}
                className="w-full px-5 py-3 rounded-xl gradient-brand text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Ver Detalles</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {delayedVideos.length > 0 && (
        <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
              <span>Vídeos Retrasados ({delayedVideos.length})</span>
            </div>
            <button
              onClick={() => onNavigate('videos')}
              className="text-xs font-semibold text-red-400 hover:text-red-300 underline"
            >
              Ir a Vídeos
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {delayedVideos.map(v => {
              const diffHours = Math.floor((Date.now() - new Date(v.scheduled_publish).getTime()) / (1000 * 3600));
              return (
                <div key={v.id} className="bg-slate-900 border border-red-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{v.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex-shrink-0">
                      +{diffHours}h retraso
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Programado: {new Date(v.scheduled_publish).toLocaleDateString('es-ES')}</span>
                    <span>Miniatura: {v.thumbnail_completed ? '✅' : '❌'} • Edición: {v.editing_completed ? '✅' : '❌'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-red-400" />
              <span>Próximas Publicaciones de YouTube</span>
            </h3>
            <button
              onClick={() => onNavigate('videos')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-3">
            {upcomingVideos.length > 0 ? (
              upcomingVideos.map(vid => (
                <div
                  key={vid.id}
                  onClick={() => onNavigate('videos')}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all hover:bg-slate-800/50"
                >
                  <div className="space-y-1 max-w-md">
                    <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                      {getGameName(vid.game_id)}
                    </span>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{vid.title}</h4>
                    <div className="text-xs text-slate-400 flex items-center gap-3 pt-1">
                      <span>
                        📅 {new Date(vid.scheduled_publish).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                      <span>
                        Estado: <strong className="text-slate-200">{vid.status}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                    <span className={vid.thumbnail_completed ? 'text-emerald-400' : 'text-slate-500'}>
                      Miniatura {vid.thumbnail_completed ? '✓' : '✗'}
                    </span>
                    <span className="text-slate-700">•</span>
                    <span className={vid.editing_completed ? 'text-emerald-400' : 'text-slate-500'}>
                      Edición {vid.editing_completed ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-sm text-slate-500">
                No hay vídeos programados para YouTube.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Mis Tareas ({myTasks.length})</span>
              </h3>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Ver Tareas
              </button>
            </div>

            <div className="space-y-2">
              {myTasks.length > 0 ? (
                myTasks.slice(0, 4).map(t => (
                  <div
                    key={t.id}
                    onClick={() => onNavigate('tasks')}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-semibold text-white line-clamp-1">{t.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {t.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 text-center py-4">
                  ¡No tienes tareas pendientes asignadas!
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <CalendarIcon className="w-4 h-4 text-cyan-400" />
              <span>Resumen del Equipo</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xl font-black text-emerald-400">
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-[11px] text-slate-400">Completadas</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xl font-black text-amber-400">
                  {pendingTasks.length}
                </div>
                <div className="text-[11px] text-slate-400">Pendientes</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xl font-black text-purple-400">
                  {streams.length}
                </div>
                <div className="text-[11px] text-slate-400">Directos</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xl font-black text-red-400">
                  {videos.length}
                </div>
                <div className="text-[11px] text-slate-400">Vídeos Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
