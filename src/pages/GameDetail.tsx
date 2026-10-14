import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { Game, Chapter, TwitchStream, YouTubeVideo } from '../types';
import { ArrowLeft, Plus, CheckCircle, Radio, RotateCcw, AlertCircle } from 'lucide-react';

interface GameDetailProps {
  gameId: string;
  onBack: () => void;
  onNavigate: (tab: any) => void;
}

export const GameDetail: React.FC<GameDetailProps> = ({ gameId, onBack, onNavigate }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [streams, setStreams] = useState<TwitchStream[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  useEffect(() => {
    const updateData = () => {
      const ws = store.getCurrentWorkspace();
      if (ws) {
        const gamesList = store.getGames(ws.id);
        const currentG = gamesList.find((g: Game) => g.id === gameId) || null;
        setGame(currentG);
        setChapters(store.getChapters(ws.id, gameId));
        setStreams(store.getStreams(ws.id).filter((s: TwitchStream) => s.game_id === gameId));
        setVideos(store.getVideos(ws.id).filter((v: YouTubeVideo) => v.game_id === gameId));
      }
    };
    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, [gameId]);

  if (!game) return null;

  const ws = store.getCurrentWorkspace();
  const currentUser = store.getCurrentUser();

  const handleCreateNextChapter = () => {
    if (!ws) return;
    const nextNum = (game.current_chapter || chapters.length || 0) + 1;
    const newChap: Chapter = {
      id: 'chap_' + Date.now(),
      workspace_id: ws.id,
      game_id: game.id,
      chapter_number: nextNum,
      title: `Capítulo ${nextNum}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    store.addChapter(newChap);
    store.logActivity({
      id: 'log_' + Date.now(),
      workspace_id: ws.id,
      action: `Capítulo ${nextNum} creado para ${game.name}`,
      user_name: `${currentUser.name} (${currentUser.username})`,
      is_system: false,
      affected_entity: 'Capítulos',
      created_at: new Date().toISOString()
    });
  };

  const handleToggleCompleteGame = () => {
    if (!ws) return;
    const newStatus = game.status === 'completed' ? 'playing' : 'completed';
    const updatedGame: Game = {
      ...game,
      status: newStatus
    };
    store.updateGame(updatedGame);
    store.logActivity({
      id: 'log_' + Date.now(),
      workspace_id: ws.id,
      action: newStatus === 'completed' ? `Serie/Juego marcado como COMPLETADO: ${game.name}` : `Serie/Juego REABIERTO: ${game.name}`,
      user_name: `${currentUser.name} (${currentUser.username})`,
      is_system: false,
      affected_entity: 'Biblioteca de Juegos',
      created_at: new Date().toISOString()
    });
    setShowCompleteConfirm(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Biblioteca</span>
        </button>

        <div className="flex items-center gap-2">
          {game.status !== 'completed' ? (
            <button
              onClick={() => setShowCompleteConfirm(true)}
              className="px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-xs hover:bg-blue-600/30 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Marcar como completado</span>
            </button>
          ) : (
            <button
              onClick={handleToggleCompleteGame}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Reabrir Serie</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="h-56 relative overflow-hidden">
          <img src={game.cover_url} alt={game.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>

        <div className="p-6 -mt-16 relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                {game.type === 'series' ? 'Serie por Capítulos' : game.type === 'standalone' ? 'Juego Completo' : 'Sin Capítulos'}
              </span>
              <h1 className="text-2xl lg:text-3xl font-black text-white mt-2">{game.name}</h1>
            </div>

            {game.type === 'series' && game.status !== 'completed' && (
              <button
                onClick={handleCreateNextChapter}
                className="px-4 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Siguiente Capítulo (Cap. {(game.current_chapter || chapters.length || 0) + 1})</span>
              </button>
            )}
          </div>

          {game.notes && <p className="text-sm text-slate-400">{game.notes}</p>}
        </div>
      </div>

      {game.type === 'series' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Tabla de Capítulos</span>
            <span className="text-xs text-slate-400 font-normal">({chapters.length} capítulos registrados)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Capítulo</th>
                  <th className="p-3">Directo Twitch</th>
                  <th className="p-3">Vídeo YouTube</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {chapters.map(ch => {
                  const s = streams.find(st => st.chapter_id === ch.id);
                  const v = videos.find(vd => vd.chapter_id === ch.id);

                  return (
                    <tr key={ch.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white">
                        Cap. {ch.chapter_number}: {ch.title}
                      </td>
                      <td className="p-3 text-slate-300">
                        {s ? (
                          <span
                            onClick={() => onNavigate('streams')}
                            className="text-purple-400 hover:underline cursor-pointer flex items-center gap-1.5"
                          >
                            <Radio className="w-3.5 h-3.5" /> {s.title} ({s.status})
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">Sin directo vinculado</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-300">
                        {v ? (
                          <span
                            onClick={() => onNavigate('videos')}
                            className="text-red-400 hover:underline cursor-pointer flex items-center gap-1.5"
                          >
                            ▶️ {v.title} ({v.status})
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">Sin vídeo vinculado</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                          {ch.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCompleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">¿Completar Serie?</h3>
                <p className="text-xs text-slate-400">Se conservarán todos los datos e historial.</p>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              ¿Quieres marcar la serie "<strong className="text-white">{game.name}</strong>" como completada? Dejará de sugerir nuevos capítulos automáticamente, pero podrás reabrirla cuando quieras.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleToggleCompleteGame}
                className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                Confirmar y Completar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
