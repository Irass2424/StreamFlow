import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { YouTubeVideo, WorkspaceMember, Game } from '../types';
import { AlertTriangle, Clock, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export const DelaysView: React.FC = () => {
  const [delayedVideos, setDelayedVideos] = useState<YouTubeVideo[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const updateData = () => {
      const ws = store.getCurrentWorkspace();
      if (ws) {
        const vids = store.getVideos(ws.id);
        setDelayedVideos(vids.filter((v: YouTubeVideo) => v.status === 'delayed'));
        setMembers(store.getMembers(ws.id));
        setGames(store.getGames(ws.id));
      }
    };
    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, []);

  const handleForceSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 1200);
  };

  const getUserName = (uId?: string) => {
    if (!uId) return 'Sin asignar';
    const m = members.find(mem => mem.user_id === uId);
    return m?.user?.name || m?.user?.username || 'Sin asignar';
  };

  const getGameName = (gId?: string) => games.find(g => g.id === gId)?.name || 'Sin juego';

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-red-950/20 p-5 rounded-2xl border border-red-500/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Sistema de Retrasos (YouTube)</h2>
            <p className="text-xs text-red-300/80">
              Vídeos programados que han superado su fecha límite de publicación sin confirmación
            </p>
          </div>
        </div>

        <button
          onClick={handleForceSync}
          disabled={syncing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-cyan-400 ${syncing ? 'animate-spin' : ''}`} />
          <span>Sincronizar con YouTube</span>
        </button>
      </div>

      <div className="space-y-4">
        {delayedVideos.length > 0 ? (
          delayedVideos.map(vid => {
            const nowMs = Date.now();
            const schedMs = new Date(vid.scheduled_publish).getTime();
            const diffHours = Math.floor((nowMs - schedMs) / (1000 * 3600));
            const diffDays = Math.floor(diffHours / 24);
            const remainingHours = diffHours % 24;

            const delayText = diffDays > 0 ? `${diffDays}d ${remainingHours}h` : `${diffHours} horas`;

            return (
              <div
                key={vid.id}
                className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      🎮 {getGameName(vid.game_id)}
                    </span>
                    <h3 className="text-lg font-black text-white">{vid.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-1.5 rounded-xl text-xs font-bold w-fit">
                    <Clock className="w-4 h-4" />
                    <span>Retraso acumulado: {delayText}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-medium">Fecha y hora previstas</div>
                    <div className="text-white font-bold">
                      {new Date(vid.scheduled_publish).toLocaleString('es-ES')}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-medium">Estado Miniatura</div>
                    <div className="flex items-center gap-2">
                      {vid.thumbnail_completed ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Completado
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Pendiente (@{getUserName(vid.thumbnail_artist_id)})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-400 font-medium">Estado Edición</div>
                    <div className="flex items-center gap-2">
                      {vid.editing_completed ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Completado
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Pendiente (@{getUserName(vid.editor_id)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-white">¡No hay vídeos retrasados!</h3>
            <p className="text-sm">Todas las publicaciones en YouTube están al día según su programación.</p>
          </div>
        )}
      </div>
    </div>
  );
};
