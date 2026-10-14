import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { YouTubeVideo, YouTubeVideoStatus, Game } from '../types';
import { Video, Plus, Clock, ExternalLink, X, Edit3 } from 'lucide-react';

export const VideosView: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<YouTubeVideo | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameId, setGameId] = useState('');
  const [scheduledPublish, setScheduledPublish] = useState('');
  const [editorId, setEditorId] = useState('');
  const [thumbArtistId, setThumbArtistId] = useState('');
  const [thumbCompleted, setThumbCompleted] = useState(false);
  const [editCompleted, setEditCompleted] = useState(false);
  const [status, setStatus] = useState<YouTubeVideoStatus>('pending');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const updateData = () => {
      const ws = store.getCurrentWorkspace();
      if (ws) {
        setVideos(store.getVideos(ws.id));
        setGames(store.getGames(ws.id));
      }
    };
    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, []);

  const ws = store.getCurrentWorkspace();
  const currentUser = store.getCurrentUser();

  const handleOpenModal = (video?: YouTubeVideo) => {
    if (video) {
      setEditingVideo(video);
      setTitle(video.title);
      setDescription(video.description || '');
      setGameId(video.game_id || '');
      setScheduledPublish(video.scheduled_publish ? new Date(video.scheduled_publish).toISOString().slice(0, 16) : '');
      setEditorId(video.editor_id || '');
      setThumbArtistId(video.thumbnail_artist_id || '');
      setThumbCompleted(video.thumbnail_completed);
      setEditCompleted(video.editing_completed);
      setStatus(video.status);
      setVideoUrl(video.video_url || '');
    } else {
      setEditingVideo(null);
      setTitle('');
      setDescription('');
      setGameId('');
      setScheduledPublish(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
      setEditorId('');
      setThumbArtistId('');
      setThumbCompleted(false);
      setEditCompleted(false);
      setStatus('pending');
      setVideoUrl('');
    }
    setIsModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws) return;

    if (editingVideo) {
      const updated: YouTubeVideo = {
        ...editingVideo,
        title: title.trim(),
        description: description.trim(),
        game_id: gameId || undefined,
        scheduled_publish: new Date(scheduledPublish).toISOString(),
        editor_id: editorId || undefined,
        thumbnail_artist_id: thumbArtistId || undefined,
        thumbnail_completed: thumbCompleted,
        editing_completed: editCompleted,
        status,
        video_url: videoUrl.trim() || undefined
      };
      store.updateVideo(updated);
      store.logActivity({
        id: 'log_' + Date.now(),
        workspace_id: ws.id,
        action: `Vídeo actualizado: ${updated.title}`,
        user_name: `${currentUser.name} (${currentUser.username})`,
        is_system: false,
        affected_entity: 'Vídeos YouTube',
        created_at: new Date().toISOString()
      });
    } else {
      const newVid: YouTubeVideo = {
        id: 'vid_' + Date.now(),
        workspace_id: ws.id,
        game_id: gameId || undefined,
        title: title.trim(),
        description: description.trim(),
        scheduled_publish: new Date(scheduledPublish).toISOString(),
        editor_id: editorId || undefined,
        thumbnail_artist_id: thumbArtistId || undefined,
        thumbnail_completed: thumbCompleted,
        editing_completed: editCompleted,
        status,
        video_url: videoUrl.trim() || undefined,
        created_at: new Date().toISOString()
      };
      store.addVideo(newVid);
      store.logActivity({
        id: 'log_' + Date.now(),
        workspace_id: ws.id,
        action: `Vídeo creado: ${newVid.title}`,
        user_name: `${currentUser.name} (${currentUser.username})`,
        is_system: false,
        affected_entity: 'Vídeos YouTube',
        created_at: new Date().toISOString()
      });
    }

    setIsModalOpen(false);
  };

  const toggleTask = (video: YouTubeVideo, taskType: 'thumb' | 'edit') => {
    const updated = { ...video };
    if (taskType === 'thumb') updated.thumbnail_completed = !updated.thumbnail_completed;
    if (taskType === 'edit') updated.editing_completed = !updated.editing_completed;

    store.updateVideo(updated);
  };

  const getGameName = (gId?: string) => games.find(g => g.id === gId)?.name || 'Juego no asignado';

  const filteredVideos = videos.filter((v: YouTubeVideo) => {
    if (statusFilter === 'all') return true;
    return v.status === statusFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Vídeos de YouTube</h2>
            <p className="text-xs text-slate-400">
              Control de tareas de miniatura, edición, programación y retrasos
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Planificar Vídeo</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'pending', label: '🩶 Pendientes' },
          { id: 'in_preparation', label: '🟡 En preparación' },
          { id: 'ready_to_upload', label: '🟢 Listos para subir' },
          { id: 'delayed', label: '🔴 Retrasados' },
          { id: 'published', label: '✅ Publicados' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === tab.id
                ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.length > 0 ? (
          filteredVideos.map(v => (
            <div
              key={v.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    🎮 {getGameName(v.game_id)}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    v.status === 'delayed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    v.status === 'ready_to_upload' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    v.status === 'published' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {v.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-2">{v.title}</h3>

                {/* Obligatory Tasks Interactivity */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Tareas Obligatorias
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => toggleTask(v, 'thumb')}
                      className={`flex items-center gap-2 font-medium transition-colors ${
                        v.thumbnail_completed ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded flex items-center justify-center border ${
                        v.thumbnail_completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                      }`}>
                        {v.thumbnail_completed && '✓'}
                      </span>
                      <span>Miniatura</span>
                    </button>

                    <button
                      onClick={() => toggleTask(v, 'edit')}
                      className={`flex items-center gap-2 font-medium transition-colors ${
                        v.editing_completed ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded flex items-center justify-center border ${
                        v.editing_completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                      }`}>
                        {v.editing_completed && '✓'}
                      </span>
                      <span>Edición</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      Publicación prevista: {new Date(v.scheduled_publish).toLocaleString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleOpenModal(v)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                {v.video_url && (
                  <a
                    href={v.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-red-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver en YouTube</span>
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-2">
            <Video className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm">No hay vídeos registrados en este filtro.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingVideo ? 'Editar Vídeo' : 'Planificar Vídeo de YouTube'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Título del Vídeo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Sons of the Forest Cap 2: EL BÚNKER SECRETO"
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
                    Fecha y Hora de Publicación *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledPublish}
                    onChange={e => setScheduledPublish(e.target.value)}
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
                  onChange={e => setStatus(e.target.value as YouTubeVideoStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="pending">🩶 Pendiente</option>
                  <option value="in_preparation">🟡 En preparación</option>
                  <option value="ready_to_upload">🟢 Listo para subir</option>
                  <option value="uploaded">📤 Subido</option>
                  <option value="scheduled">📅 Programado</option>
                  <option value="delayed">🔴 Retrasado</option>
                  <option value="published">✅ Publicado</option>
                  <option value="cancelled">⚫ Cancelado</option>
                </select>
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
                  Guardar Vídeo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
