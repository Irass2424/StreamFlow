import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { Workspace } from '../types';
import { ChevronDown, Plus, Check, Building2 } from 'lucide-react';

export const WorkspaceSelector: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(store.getWorkspaces());
  const [currentWs, setCurrentWs] = useState<Workspace>(store.getCurrentWorkspace());
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setWorkspaces(store.getWorkspaces());
      setCurrentWs(store.getCurrentWorkspace());
    });
    return unsub;
  }, []);

  const handleSelect = (ws: Workspace) => {
    store.setCurrentWorkspaceId(ws.id);
    setIsOpen(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    const user = store.getCurrentUser();
    const newWs: Workspace = {
      id: 'ws_' + Date.now(),
      name: newWsName.trim(),
      logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=250&q=80',
      description: newWsDesc.trim(),
      owner_id: user.id,
      created_at: new Date().toISOString()
    };

    store.addWorkspace(newWs);
    store.addMember({
      id: 'wm_' + Date.now(),
      workspace_id: newWs.id,
      user_id: user.id,
      role: 'admin',
      joined_at: new Date().toISOString(),
      user
    });

    store.setCurrentWorkspaceId(newWs.id);
    setNewWsName('');
    setNewWsDesc('');
    setShowCreateModal(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={currentWs.logo_url}
            alt={currentWs.name}
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/30 flex-shrink-0"
          />
          <div className="text-left truncate">
            <div className="text-sm font-semibold truncate text-white">{currentWs.name}</div>
            <div className="text-xs text-slate-400 truncate">Espacio de Trabajo</div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 z-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 space-y-1">
            <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tus Espacios de Trabajo
            </div>
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => handleSelect(ws)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm text-left transition-colors ${
                  ws.id === currentWs.id ? 'bg-cyan-950/40 text-cyan-400 font-medium' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <img src={ws.logo_url} alt={ws.name} className="w-6 h-6 rounded object-cover" />
                  <span className="truncate">{ws.name}</span>
                </div>
                {ws.id === currentWs.id && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
              </button>
            ))}

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full flex items-center gap-2 p-2 rounded-lg text-sm font-medium text-cyan-400 hover:bg-cyan-950/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Crear nuevo espacio</span>
              </button>
            </div>
          </div>
        </>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Nuevo Espacio de Trabajo</h3>
                <p className="text-xs text-slate-400">Organiza un nuevo canal o proyecto de equipo</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombre del canal o equipo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. AIT24 Gaming Channel"
                  value={newWsName}
                  onChange={e => setNewWsName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Descripción breve de los objetivos del espacio"
                  value={newWsDesc}
                  onChange={e => setNewWsDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold rounded-xl gradient-brand text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
                >
                  Crear Espacio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
