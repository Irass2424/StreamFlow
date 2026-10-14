import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { Integration } from '../types';
import { Settings, Radio, Video, RefreshCw, Trash2, Building2 } from 'lucide-react';

export const WorkspaceSettingsView: React.FC = () => {
  const [ws, setWs] = useState(store.getCurrentWorkspace());
  const [name, setName] = useState(ws?.name || '');
  const [description, setDescription] = useState(ws?.description || '');
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    const updateData = () => {
      const currentWs = store.getCurrentWorkspace();
      setWs(currentWs);
      if (currentWs) {
        setName(currentWs.name);
        setDescription(currentWs.description || '');
        setIntegrations(store.getIntegrations(currentWs.id));
      }
    };
    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, []);

  if (!ws) return null;

  const handleSaveWorkspaceInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...ws,
      name: name.trim(),
      description: description.trim()
    };
    store.addWorkspace(updated);
  };

  const handleToggleIntegration = (integ: Integration) => {
    const updated: Integration = {
      ...integ,
      connected: !integ.connected,
      last_sync: new Date().toISOString()
    };
    store.updateIntegration(updated);
  };

  const twitchInteg = integrations.find(i => i.platform === 'twitch');
  const youtubeInteg = integrations.find(i => i.platform === 'youtube');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Ajustes del Espacio de Trabajo</h2>
          <p className="text-xs text-slate-400">
            Configuración general del canal, integraciones con Twitch/YouTube y opciones avanzadas
          </p>
        </div>
      </div>

      {/* Workspace Details Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Building2 className="w-5 h-5 text-cyan-400" />
          <span>Información del Espacio</span>
        </h3>

        <form onSubmit={handleSaveWorkspaceInfo} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nombre del Espacio *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Descripción del Canal
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold rounded-xl gradient-brand text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
          >
            Guardar Cambios
          </button>
        </form>
      </div>

      {/* Integrations Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <RefreshCw className="w-5 h-5 text-purple-400" />
          <span>Integraciones Oficiales Conectadas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Twitch Integration */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Twitch Official API</h4>
                  <p className="text-xs text-slate-400">
                    {twitchInteg?.channel_name ? `@${twitchInteg.channel_name}` : 'Sin canal'}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                twitchInteg?.connected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {twitchInteg?.connected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>

            <button
              onClick={() => twitchInteg && handleToggleIntegration(twitchInteg)}
              className="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              {twitchInteg?.connected ? 'Desconectar Twitch' : 'Conectar Cuenta de Twitch'}
            </button>
          </div>

          {/* YouTube Integration */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">YouTube Data API v3</h4>
                  <p className="text-xs text-slate-400">
                    {youtubeInteg?.channel_name || 'Sin canal'}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                youtubeInteg?.connected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {youtubeInteg?.connected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>

            <button
              onClick={() => youtubeInteg && handleToggleIntegration(youtubeInteg)}
              className="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              {youtubeInteg?.connected ? 'Desconectar YouTube' : 'Conectar Cuenta de YouTube'}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-red-400 flex items-center gap-2 border-b border-red-500/20 pb-3">
          <Trash2 className="w-5 h-5" />
          <span>Zona de Peligro</span>
        </h3>

        <p className="text-xs text-slate-400">
          Eliminar este espacio de trabajo borrará permanentemente todos sus directos, tareas, historial y configuraciones.
        </p>

        <button
          onClick={() => alert("Para eliminar el espacio de trabajo contacte con soporte.")}
          className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-colors"
        >
          Eliminar Espacio de Trabajo
        </button>
      </div>
    </div>
  );
};
