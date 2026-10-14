import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { Task, WorkspaceMember } from '../types';
import { CheckSquare, Plus, LayoutGrid, List, CheckCircle2, Circle, X } from 'lucide-react';

export const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<'thumbnail' | 'editing' | 'general'>('general');

  useEffect(() => {
    const updateData = () => {
      const ws = store.getCurrentWorkspace();
      if (ws) {
        setTasks(store.getTasks(ws.id));
        setMembers(store.getMembers(ws.id));
      }
    };
    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, []);

  const ws = store.getCurrentWorkspace();
  const currentUser = store.getCurrentUser();

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws) return;

    const newTask: Task = {
      id: 'task_' + Date.now(),
      workspace_id: ws.id,
      title: title.trim(),
      assigned_user_id: assignedUserId || currentUser.id,
      status: 'pending',
      due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      type,
      created_at: new Date().toISOString()
    };

    store.addTask(newTask);
    store.logActivity({
      id: 'log_' + Date.now(),
      workspace_id: ws.id,
      action: `Tarea creada: ${newTask.title}`,
      user_name: `${currentUser.name} (${currentUser.username})`,
      is_system: false,
      affected_entity: 'Tareas',
      created_at: new Date().toISOString()
    });

    setTitle('');
    setIsModalOpen(false);
  };

  const toggleTaskStatus = (task: Task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updated: Task = {
      ...task,
      status: nextStatus
    };
    store.updateTask(updated);
  };

  const getAssigneeName = (uId?: string) => {
    if (!uId) return 'Sin asignar';
    const m = members.find(mem => mem.user_id === uId);
    return m?.user?.name || m?.user?.username || 'Sin asignar';
  };

  const filteredTasks = tasks.filter(t => {
    if (assigneeFilter === 'all') return true;
    if (assigneeFilter === 'me') return t.assigned_user_id === currentUser.id;
    return t.assigned_user_id === assigneeFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Gestión de Tareas</h2>
            <p className="text-xs text-slate-400">
              Asignación de miniaturas, edición y tareas generales del equipo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setAssigneeFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            assigneeFilter === 'all'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Todas las tareas
        </button>
        <button
          onClick={() => setAssigneeFilter('me')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            assigneeFilter === 'me'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Mis Tareas (@{currentUser.username})
        </button>
      </div>

      {viewMode === 'list' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-2 p-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(t => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all gap-4"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskStatus(t)}
                    className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {t.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </button>

                  <div>
                    <h4 className={`text-sm font-semibold ${t.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
                      {t.title}
                    </h4>
                    <div className="text-xs text-slate-400 flex items-center gap-3 pt-0.5">
                      <span>👤 {getAssigneeName(t.assigned_user_id)}</span>
                      {t.due_date && (
                        <span>📅 {new Date(t.due_date).toLocaleDateString('es-ES')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-slate-900 border border-slate-800 text-slate-300">
                  {t.type}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 text-sm">
              No hay tareas registradas en esta vista.
            </div>
          )}
        </div>
      )}

      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {['pending', 'in_progress', 'completed'].map(st => {
            const colsTasks = filteredTasks.filter(t => t.status === st);
            return (
              <div key={st} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    {st === 'pending' ? 'Pendiente' : st === 'in_progress' ? 'En Progreso' : 'Completado'} ({colsTasks.length})
                  </h3>
                </div>

                <div className="space-y-2">
                  {colsTasks.map(t => (
                    <div key={t.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-white">{t.title}</h4>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>👤 {getAssigneeName(t.assigned_user_id)}</span>
                        <button
                          onClick={() => toggleTaskStatus(t)}
                          className="text-emerald-400 hover:underline font-semibold"
                        >
                          {t.status === 'completed' ? 'Reabrir' : 'Completar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Nueva Tarea</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Título de la tarea *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Diseñar miniatura para canal"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Asignar a
                </label>
                <select
                  value={assignedUserId}
                  onChange={e => setAssignedUserId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Seleccionar miembro...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.user_id}>
                      {m.user?.name} ({m.user?.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tipo de Tarea
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="general">General</option>
                  <option value="thumbnail">Miniatura</option>
                  <option value="editing">Edición</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Fecha Límite
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
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
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
