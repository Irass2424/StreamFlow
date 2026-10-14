import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import type { TwitchStream, YouTubeVideo } from '../types';
import { Calendar as CalendarIcon, Radio, Video, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  onNavigate: (tab: any) => void;
}

type CalendarPerspective = 'month' | 'week' | 'day' | 'agenda';

export const CalendarView: React.FC<CalendarViewProps> = ({ onNavigate }) => {
  const [perspective, setPerspective] = useState<CalendarPerspective>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [streams, setStreams] = useState<TwitchStream[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  const [platformFilter, setPlatformFilter] = useState<'all' | 'twitch' | 'youtube'>('all');

  useEffect(() => {
    const updateData = () => {
      const ws = store.getCurrentWorkspace();
      if (ws) {
        setStreams(store.getStreams(ws.id));
        setVideos(store.getVideos(ws.id));
      }
    };
    updateData();
    const unsub = store.subscribe(updateData);
    return unsub;
  }, []);

  const allEvents = [
    ...streams.map(s => ({
      id: s.id,
      title: s.title,
      type: 'twitch' as const,
      date: new Date(s.scheduled_start),
      status: s.status,
      gameId: s.game_id
    })),
    ...videos.map(v => ({
      id: v.id,
      title: v.title,
      type: 'youtube' as const,
      date: new Date(v.scheduled_publish),
      status: v.status,
      gameId: v.game_id
    }))
  ].filter(e => {
    if (platformFilter === 'twitch') return e.type === 'twitch';
    if (platformFilter === 'youtube') return e.type === 'youtube';
    return true;
  });

  const conflicts: Array<{ event1: string; event2: string }> = [];
  for (let i = 0; i < allEvents.length; i++) {
    for (let j = i + 1; j < allEvents.length; j++) {
      const diffMs = Math.abs(allEvents[i].date.getTime() - allEvents[j].date.getTime());
      if (diffMs < 3600000) {
        conflicts.push({
          event1: allEvents[i].title,
          event2: allEvents[j].title
        });
      }
    }
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white capitalize">
              {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-xs text-slate-400">
              Planificación general de directos y contenidos
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                platformFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setPlatformFilter('twitch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                platformFilter === 'twitch' ? 'bg-purple-600/30 text-purple-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" /> Twitch
            </button>
            <button
              onClick={() => setPlatformFilter('youtube')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                platformFilter === 'youtube' ? 'bg-red-600/30 text-red-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> YouTube
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['month', 'week', 'day', 'agenda'] as CalendarPerspective[]).map(p => (
              <button
                key={p}
                onClick={() => setPerspective(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  perspective === p ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p === 'month' ? 'Mes' : p === 'week' ? 'Semana' : p === 'day' ? 'Día' : 'Agenda'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {conflicts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <strong>Aviso de conflicto horario:</strong> Existen eventos programados con menos de 1 hora de diferencia.
          </div>
        </div>
      )}

      {perspective === 'month' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="grid grid-cols-7 text-center border-b border-slate-800 bg-slate-950 py-3 text-xs font-bold text-slate-400 uppercase">
            <span>Dom</span>
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
          </div>

          <div className="grid grid-cols-7 auto-rows-fr gap-px bg-slate-800">
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-slate-950/60 min-h-[110px] p-2" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayEvents = allEvents.filter(
                e => e.date.getFullYear() === year && e.date.getMonth() === month && e.date.getDate() === dayNum
              );

              const isToday =
                new Date().getDate() === dayNum &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`bg-slate-900 min-h-[110px] p-2 flex flex-col justify-between transition-colors hover:bg-slate-800/40 ${
                    isToday ? 'ring-2 ring-cyan-500/50 bg-cyan-950/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center'
                          : 'text-slate-400'
                      }`}
                    >
                      {dayNum}
                    </span>
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-[80px]">
                    {dayEvents.map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => onNavigate(ev.type === 'twitch' ? 'streams' : 'videos')}
                        className={`p-1.5 rounded-lg text-[10px] font-semibold truncate cursor-pointer transition-transform hover:scale-102 ${
                          ev.type === 'twitch'
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                            : 'bg-red-950/80 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {ev.type === 'twitch' ? '🟣' : '🔴'} {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {perspective === 'agenda' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Agenda Próxima</h3>
          <div className="space-y-3">
            {allEvents.length > 0 ? (
              allEvents
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map(ev => (
                  <div
                    key={ev.id}
                    onClick={() => onNavigate(ev.type === 'twitch' ? 'streams' : 'videos')}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          ev.type === 'twitch'
                            ? 'bg-purple-500/10 text-purple-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {ev.type === 'twitch' ? <Radio className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                        <div className="text-xs text-slate-400">
                          {ev.date.toLocaleString('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                      {ev.status}
                    </span>
                  </div>
                ))
            ) : (
              <div className="text-center text-slate-500 py-8 text-sm">
                No hay eventos registrados en la agenda.
              </div>
            )}
          </div>
        </div>
      )}

      {(perspective === 'week' || perspective === 'day') && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center space-y-3">
          <CalendarIcon className="w-10 h-10 text-cyan-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Vista en desarrollo</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Utilice la vista mensual o de agenda para consultar todos los eventos programados en directo.
          </p>
        </div>
      )}
    </div>
  );
};
