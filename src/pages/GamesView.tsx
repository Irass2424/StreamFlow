import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { Game, GameType, GameStatus } from '../types';
import { Gamepad2, Plus, ChevronRight, X } from 'lucide-react';

interface GamesViewProps {
  onSelectGame: (gameId: string) => void;
}

export const GamesView: React.FC<GamesViewProps> = ({ onSelectGame }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [type, setType] = useState<GameType>('series');
  const [status, setStatus] = useState<GameStatus>('playing');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const updateData = () => {
      const ws = store.getCurrentWorkspace();
      if (ws) {
        setGames(store.getGames(ws.id));
      }
    };
    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, []);

  const ws = store.getCurrentWorkspace();
  const currentUser = store.getCurrentUser();

  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws) return;

    const newGame: Game = {
      id: 'game_' + Date.now(),
      workspace_id: ws.id,
      name: name.trim(),
      cover_url: coverUrl.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
      status,
      type,
      current_chapter: type === 'series' ? 1 : undefined,
      next_chapter_suggested: type === 'series' ? 2 : undefined,
      notes: notes.trim(),
      created_at: new Date().toISOString()
    };

    store.addGame(newGame);

    if (type === 'series') {
      store.addChapter({
        id: 'chap_' + Date.now(),
        workspace_id: ws.id,
        game_id: newGame.id,
        chapter_number: 1,
        title: 'Capítulo 1',
        status: 'pending',
        created_at: new Date().toISOString()
      });
    }

    store.logActivity({
      id: 'log_' + Date.now(),
      workspace_id: ws.id,
      action: `Juego añadido a la biblioteca: ${newGame.name}`,
      user_name: `${currentUser.name} (${currentUser.username})`,
      is_system: false,
      affected_entity: 'Biblioteca de Juegos',
      created_at: new Date().toISOString()
    });

    setName('');
    setCoverUrl('');
    setNotes('');
    setIsModalOpen(false);
  };

  const filteredGames = games.filter((g: Game) => {
    if (statusFilter === 'all') return true;
    return g.status === statusFilter;
  });

  const getStatusBadge = (st: GameStatus) => {
    switch (st) {
      case 'playing':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🟢 Jugando</span>;
      case 'upcoming':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">🟡 Próximamente</span>;
      case 'paused':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400">⚪ En Pausa</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">🔵 Completado</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Biblioteca de Juegos</h2>
            <p className="text-xs text-slate-400">
              Gestión de series por capítulos, juegos completos y títulos continuos
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Juego</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'playing', label: '🟢 Jugando' },
          { id: 'upcoming', label: '🟡 Próximamente' },
          { id: 'paused', label: '⚪ En Pausa' },
          { id: 'completed', label: '🔵 Completados' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === tab.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.length > 0 ? (
          filteredGames.map(game => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={game.cover_url}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute top-3 right-3">{getStatusBadge(game.status)}</div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-black text-white drop-shadow-md">{game.name}</h3>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Tipo:{' '}
                    <strong className="text-slate-200 uppercase">
                      {game.type === 'series' ? 'Serie Capítulos' : game.type === 'standalone' ? 'Juego Completo' : 'Sin Capítulos'}
                    </strong>
                  </span>

                  {game.type === 'series' && (
                    <span className="text-cyan-400 font-bold bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                      Cap. actual: {game.current_chapter || 1}
                    </span>
                  )}
                </div>

                {game.notes && (
                  <p className="text-xs text-slate-400 line-clamp-2">{game.notes}</p>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Ver Ficha y Capítulos</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-2">
            <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm">No se encontraron juegos en esta categoría.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Añadir Nuevo Juego</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGame} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombre del juego *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Sons of the Forest"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tipo de Gestión *
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as GameType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="series">Serie por Capítulos (e.g., Sons of the Forest)</option>
                  <option value="standalone">Juego Completo (1 directo/vídeo)</option>
                  <option value="continuous">Sin Capítulos (e.g., Minecraft)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Estado Inicial
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as GameStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="playing">🟢 Jugando actualmente</option>
                  <option value="upcoming">🟡 Próximamente</option>
                  <option value="paused">⚪ En pausa</option>
                  <option value="completed">🔵 Completado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  URL Portada (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={coverUrl}
                  onChange={e => setCoverUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Notas / Observaciones
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold rounded-xl gradient-brand text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
                >
                  Guardar Juego
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
