import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { WorkspaceMember, Invitation, UserRole } from '../types';
import { Users, UserPlus, Shield, Mail, X } from 'lucide-react';

export const TeamView: React.FC = () => {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // Modal invite
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invitedUsername, setInvitedUsername] = useState('');
  const [role, setRole] = useState<UserRole>('editor');

  useEffect(() => {
    const updateData = () => {
      const ws = store.getCurrentWorkspace();
      if (ws) {
        setMembers(store.getMembers(ws.id));
        setInvitations(store.getInvitations(ws.id));
      }
    };
    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, []);

  const ws = store.getCurrentWorkspace();
  const currentUser = store.getCurrentUser();

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws || !invitedUsername.trim()) return;

    const formattedUsername = invitedUsername.trim().startsWith('@') ? invitedUsername.trim() : `@${invitedUsername.trim()}`;

    const newInv: Invitation = {
      id: 'inv_' + Date.now(),
      workspace_id: ws.id,
      invited_username: formattedUsername,
      invited_by_user_id: currentUser.id,
      role,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    store.addInvitation(newInv);
    store.logActivity({
      id: 'log_' + Date.now(),
      workspace_id: ws.id,
      action: `Invitación enviada a ${formattedUsername} como ${role.toUpperCase()}`,
      user_name: `${currentUser.name} (${currentUser.username})`,
      is_system: false,
      affected_entity: 'Equipo y Permisos',
      created_at: new Date().toISOString()
    });

    setInvitedUsername('');
    setIsModalOpen(false);
  };

  const handleUpdateRole = (memberId: string, newRole: UserRole) => {
    store.updateMemberRole(memberId, newRole);
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'admin':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">👑 Admin / Creador</span>;
      case 'moderator':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">🛡️ Moderador</span>;
      case 'editor':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🎬 Editor</span>;
      case 'thumbnail_artist':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">🎨 Miniaturista</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400">👤 Personalizado</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Equipo y Permisos</h2>
            <p className="text-xs text-slate-400">
              Administra colaboradores del canal, asigna roles e invita miembros por @usuario
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invitar Colaborador</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span>Miembros del Espacio ({members.length})</span>
        </h3>

        <div className="divide-y divide-slate-800/80">
          {members.map(m => (
            <div key={m.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={m.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  alt={m.user?.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{m.user?.name}</h4>
                  <div className="text-xs text-slate-400">
                    {m.user?.username} • {m.user?.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getRoleBadge(m.role)}

                {m.role !== 'admin' && (
                  <select
                    value={m.role}
                    onChange={e => handleUpdateRole(m.id, e.target.value as UserRole)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="moderator">Moderador</option>
                    <option value="editor">Editor</option>
                    <option value="thumbnail_artist">Miniaturista</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {invitations.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Mail className="w-5 h-5 text-amber-400" />
            <span>Invitaciones Pendientes ({invitations.length})</span>
          </h3>

          <div className="space-y-2">
            {invitations.map(inv => (
              <div key={inv.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-white">{inv.invited_username}</div>
                  <div className="text-xs text-slate-400">Rol asignado: {inv.role} • Estado: {inv.status}</div>
                </div>
                {getRoleBadge(inv.role)}
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Invitar al Equipo</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombre de usuario StreamFlow *
                </label>
                <input
                  type="text"
                  required
                  placeholder="@usuario"
                  value={invitedUsername}
                  onChange={e => setInvitedUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Rol asignado *
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="moderator">Moderador (gestión directos)</option>
                  <option value="editor">Editor (revisar vídeos y edición)</option>
                  <option value="thumbnail_artist">Miniaturista (revisar miniaturas)</option>
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
                  Enviar Invitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
