import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { ActivityLog } from '../types';
import { History, User, Bot, Clock } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'user' | 'system'>('all');

  useEffect(() => {
    const updateData = () => {
      const ws = store.getCurrentWorkspace();
      if (ws) {
        setLogs(store.getActivityLogs(ws.id));
      }
    };
    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, []);

  const filteredLogs = logs.filter(l => {
    if (filter === 'user') return !l.is_system;
    if (filter === 'system') return l.is_system;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Historial de Actividad</h2>
            <p className="text-xs text-slate-400">
              Registro auditado de acciones manuales y cambios automáticos del sistema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({logs.length})
          </button>
          <button
            onClick={() => setFilter('user')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'user' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Manuales
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'system' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Automáticos
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        {filteredLogs.length > 0 ? (
          <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 py-2">
            {filteredLogs.map(log => (
              <div key={log.id} className="relative pl-6">
                <div
                  className={`absolute -left-[17px] top-0 p-1.5 rounded-full border ${
                    log.is_system
                      ? 'bg-purple-950 border-purple-500 text-purple-400'
                      : 'bg-cyan-950 border-cyan-500 text-cyan-400'
                  }`}
                >
                  {log.is_system ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">{log.action}</span>
                    {log.affected_entity && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-400">
                        {log.affected_entity}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>{log.user_name}</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm">
            No se encontraron registros de actividad.
          </div>
        )}
      </div>
    </div>
  );
};
