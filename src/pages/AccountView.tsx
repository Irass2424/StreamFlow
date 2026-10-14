import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { User } from '../types';
import { User as UserIcon, Shield, Check } from 'lucide-react';

export const AccountView: React.FC = () => {
  const [user, setUser] = useState<User>(store.getCurrentUser());
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const curr = store.getCurrentUser();
      setUser(curr);
      setName(curr.name);
      setUsername(curr.username);
      setEmail(curr.email);
    });
    return unsub;
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      name: name.trim(),
      username: username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`,
      email: email.trim()
    };
    store.updateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
          <UserIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Mi Cuenta Personal</h2>
          <p className="text-xs text-slate-400">
            Gestiona tu perfil personal, cuenta conectada de Google y preferencias
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl max-w-2xl">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/30"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{user.name}</h3>
            <p className="text-xs text-slate-400">{user.username} • {user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nombre Visible *
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
                Nombre de Usuario (@) *
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Cuenta de Google conectada con Supabase Auth</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Activa
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-xl gradient-brand text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
            >
              Guardar Perfil
            </button>

            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Perfil guardado correctamente
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
