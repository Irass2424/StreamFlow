import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { TwitchStream, TwitchStreamStatus, Game } from '../types';
import { Radio, Plus, Clock, ExternalLink, X, Edit3 } from 'lucide-react';

export const StreamsView: React.FC = () => {
  const [streams, setStreams] = useState<TwitchStream[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Modal create/edit stream
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<TwitchStream | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameId, setGameId] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [scheduledStart, setScheduledStart] = useState('');
  const [channelUrl, setChannelUrl] = useState('https://twitch.tv/ait24');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<TwitchStreamStatus>('scheduled');

  useEffect(() => {
    const updateData = () => {
      const ws = store.getCurrentWorkspace();
      if (ws) {
        setStreams(store.getStreams(ws.id));
        setGames(store.getGames(ws.id));
      }
    };
    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, []);

  const ws = store.getCurrentWorkspace();
  const currentUser = store.getCurrentUser();

  const handleOpenModal = (stream?: TwitchStream) => {
    if (stream) {
      setEditingStream(stream);
      setTitle(stream.title);
      setDescription(stream.description || '');
      setGameId(stream.game_id || '');
      setChapterId(stream.chapter_id || '');
      setScheduledStart(stream.scheduled_start ? new Date(stream.scheduled_start).toISOString().slice(0, 16) : '');
      setChannelUrl(stream.channel_url || 'https://twitch.tv/ait24');
      setNotes(stream.notes || '');
      setStatus(stream.status);
    } else {
      setEditingStream(null);
      setTitle('');
      setDescription('');
      setGameId('');
      setChapterId('');
      setScheduledStart(new Date(Date.now() + 3600000).toISOString().slice(0, 16));
      setChannelUrl('https://twitch.tv/ait24');
      setNotes('');
      setStatus('scheduled');
    }
    setIsModalOpen(true);
  };

  const handleSaveStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws) return;

    if (editingStream) {
      const updated: TwitchStream = {
        ...editingStream,
        title: title.trim(),
        description: description.trim(),
        game_id: gameId || undefined,
        chapter_id: chapterId || undefined,
        scheduled_start: new Date(scheduledStart).toISOString(),
        channel_url: channelUrl.trim(),
        notes: notes.trim(),
        status
      };
      store.updateStream(updated);
      store.logActivity({
        id: 'log_' + Date.now(),
        workspace_id: ws.id,
        action: `Directo actualizado: ${updated.title}`,
        user_name: `${currentUser.name} (${currentUser.username})`,
        is_system: false,
        affected_entity: 'Directos',
        created_at: new Date().toISOString()
      });
    } else {
      const newStream: TwitchStream = {
        id: 'stream_' + Date.now(),
        workspace_id: ws.id,
        game_id: gameId || undefined,
        chapter_id: chapterId || undefined,
        title: title.trim(),
        description: description.trim(),
        scheduled_start: new Date(scheduledStart).toISOString(),
        participant_user_ids: [currentUser.id],
        channel_url: channelUrl.trim(),
        notes: notes.trim(),
        status,
        created_at: new Date().toISOString()
      };
      store.addStream(newStream);
      store.logActivity({
        id: 'log_' + Date.now(),
        workspace_id: ws.id,
        action: `Directo creado: ${newStream.title}`,
        user_name: `${currentUser.name} (${currentUser.username})`,
        is_system: false,
        affected_entity: 'Directos',
        created_at: new Date().toISOString()
      });
    }

    setIsModalOpen(false);
  };

  const handleUpdateStatus = (stream: TwitchStream, newStatus: TwitchStreamStatus) => {
    const nowISO = new Date().toISOString();
    const updated: TwitchStream = {
      ...stream,
      status: newStatus,
      actual_start: newStatus === 'live' ? (stream.actual_start || nowISO) : stream.actual_start,
      actual_end: newStatus === 'finished' ? nowISO : stream.actual_end
    };

    if (newStatus === 'finished' && updated.actual_start && updated.actual_end) {
      const diffMin = Math.round((new Date(updated.actual_end).getTime() - new Date(updated.actual_start).getTime()) / 60000);
      updated.duration_minutes = Math.max(diffMin, 1);
    }

    store.updateStream(updated);
    store.logActivity({
      id: 'log_' + Date.now(),
      workspace_id: ws?.id || '',
      action: `Cambio manual de estado a ${newStatus.toUpperCase()}: ${stream.title}`,
      user_name: `${currentUser.name} (${currentUser.username})`,
      is_system: false,
      affected_entity: 'Directos',
      created_at: new Date().toISOString()
    });
  };

  const filteredStreams = streams.filter(s => {
    if (selectedStatusFilter === 'all') return true;
    return s.status === selectedStatusFilter;
  });

  const getGameName = (gId?: string) => games.find(g => g.id === gId)?.name || 'Juego no asignado';

  const getStatusBadge = (st: TwitchStreamStatus) => {
    switch (st) {
      case 'live':
        return <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-600 text-white animate-pulse flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white" /> EN DIRECTO</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">🟡 PREPARANDO</span>;
      case 'finished':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">⚪ TERMINADO</span>;
      case 'delayed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">🔴 RETRASADO</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-500">⚫ CANCELADO</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">🗓️ PROGRAMADO</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Directos de Twitch</h2>
            <p className="text-xs text-slate-400">
              Planifica directos, gestiona estados automáticos y controla emisiones
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Programar Directo</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'scheduled', label: 'Programados' },
          { id: 'preparing', label: 'Preparando' },
          { id: 'live', label: 'En Directo' },
          { id: 'finished', label: 'Terminados' },
          { id: 'delayed', label: 'Retrasados' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStatusFilter === tab.id
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStreams.length > 0 ? (
          filteredStreams.map(s => (
            <div
              key={s.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    🎮 {getGameName(s.game_id)}
                  </span>
                  {getStatusBadge(s.status)}
                </div>

                <h3 className="text-base font-bold text-white line-clamp-2">{s.title}</h3>

                {s.description && (
                  <p className="text-xs text-slate-400 line-clamp-2">{s.description}</p>
                )}

                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      Programado: {new Date(s.scheduled_start).toLocaleString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {s.duration_minutes && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>⏱️ Duración real: {s.duration_minutes} min</span>
                    </div>
                  )}

                  {s.channel_url && (
                    <a
                      href={s.channel_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-purple-400 hover:underline pt-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ir al canal de Twitch</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {s.status !== 'live' && s.status !== 'finished' && (
                    <button
                      onClick={() => handleUpdateStatus(s, 'live')}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-600/30 transition-colors"
                      title="Marcar como En Directo"
                    >
                      Iniciar
                    </button>
                  )}
                  {s.status === 'live' && (
                    <button
                      onClick={() => handleUpdateStatus(s, 'finished')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold hover:bg-slate-700 transition-colors"
                      title="Terminar Directo"
                    >
                      Terminar
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(s)}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                    title="Editar Directo"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-2">
            <Radio className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm">No se encontraron directos en esta categoría.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingStream ? 'Editar Directo' : 'Programar Nuevo Directo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStream} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Título del Directo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Sons of the Forest - Capítulo 3: Explorando las Cuevas"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Juego Relacionado
                  </label>
                  <select
                    value={gameId}
                    onChange={e => setGameId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Seleccionar juego...</option>
                    {games.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Fecha y Hora Prevista *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledStart}
                    onChange={e => setScheduledStart(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as TwitchStreamStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="scheduled">🗓️ Programado</option>
                  <option value="preparing">🟡 Preparando</option>
                  <option value="live">🔴 En directo</option>
                  <option value="finished">⚪ Terminado</option>
                  <option value="delayed">🔴 Retrasado</option>
                  <option value="cancelled">⚫ Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Descripción o Notas
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
                  Guardar Directo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
