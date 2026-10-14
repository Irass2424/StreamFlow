import type {
  User,
  Workspace,
  WorkspaceMember,
  Invitation,
  Game,
  Chapter,
  TwitchStream,
  YouTubeVideo,
  Task,
  Notification,
  Integration,
  ActivityLog
} from '../types';

export const INITIAL_USER: User = {
  id: 'usr_demo_1',
  name: 'Alex Rivera',
  username: '@alexrivera',
  email: 'alex@ait24.tv',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  google_connected: true,
  notification_preferences: { email: true, app: true, reminders: true },
  appearance_preferences: { theme: 'dark', compact_sidebar: false },
  privacy_settings: { show_online_status: true }
};

export const INITIAL_MEMBERS_USERS: User[] = [
  INITIAL_USER,
  {
    id: 'usr_editor_2',
    name: 'Carlos Editor',
    username: '@carlosedit',
    email: 'carlos@ait24.tv',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    google_connected: true,
    notification_preferences: { email: true, app: true, reminders: true },
    appearance_preferences: { theme: 'dark', compact_sidebar: false },
    privacy_settings: { show_online_status: true }
  },
  {
    id: 'usr_thumb_3',
    name: 'Elena Art',
    username: '@elenagfx',
    email: 'elena@ait24.tv',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    google_connected: false,
    notification_preferences: { email: true, app: true, reminders: false },
    appearance_preferences: { theme: 'dark', compact_sidebar: false },
    privacy_settings: { show_online_status: true }
  },
  {
    id: 'usr_mod_4',
    name: 'David Mod',
    username: '@davidmod',
    email: 'david@ait24.tv',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    google_connected: true,
    notification_preferences: { email: true, app: true, reminders: true },
    appearance_preferences: { theme: 'dark', compact_sidebar: false },
    privacy_settings: { show_online_status: true }
  }
];

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws_ait24',
    name: 'AIT24 Channel',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=250&q=80',
    description: 'Espacio de trabajo principal para streams de Twitch y contenidos de YouTube.',
    owner_id: 'usr_demo_1',
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'ws_secondary',
    name: 'StreamFlow Gaming Extra',
    logo_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=250&q=80',
    description: 'Canal secundario de clips y momentos destacados.',
    owner_id: 'usr_demo_1',
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_WORKSPACE_MEMBERS: WorkspaceMember[] = [
  {
    id: 'wm_1',
    workspace_id: 'ws_ait24',
    user_id: 'usr_demo_1',
    role: 'admin',
    joined_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    user: INITIAL_USER
  },
  {
    id: 'wm_2',
    workspace_id: 'ws_ait24',
    user_id: 'usr_editor_2',
    role: 'editor',
    joined_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    user: INITIAL_MEMBERS_USERS[1]
  },
  {
    id: 'wm_3',
    workspace_id: 'ws_ait24',
    user_id: 'usr_thumb_3',
    role: 'thumbnail_artist',
    joined_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    user: INITIAL_MEMBERS_USERS[2]
  },
  {
    id: 'wm_4',
    workspace_id: 'ws_ait24',
    user_id: 'usr_mod_4',
    role: 'moderator',
    joined_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    user: INITIAL_MEMBERS_USERS[3]
  }
];

export const INITIAL_GAMES: Game[] = [
  {
    id: 'game_sof',
    workspace_id: 'ws_ait24',
    name: 'Sons of the Forest',
    cover_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
    status: 'playing',
    type: 'series',
    current_chapter: 3,
    next_chapter_suggested: 4,
    notes: 'Serie activa de terror y supervivencia.',
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'game_ash',
    workspace_id: 'ws_ait24',
    name: 'A Short Hike',
    cover_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
    status: 'playing',
    type: 'standalone',
    notes: 'Juego corto indieworld para directo completo.',
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'game_mc',
    workspace_id: 'ws_ait24',
    name: 'Minecraft',
    cover_url: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=400&q=80',
    status: 'playing',
    type: 'continuous',
    notes: 'Survival multijugador con subs.',
    created_at: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 'chap_sof_1',
    workspace_id: 'ws_ait24',
    game_id: 'game_sof',
    chapter_number: 1,
    title: 'El Accidente en la Isla',
    status: 'completed',
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'chap_sof_2',
    workspace_id: 'ws_ait24',
    game_id: 'game_sof',
    chapter_number: 2,
    title: 'Búnker de la Muerte',
    status: 'completed',
    created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'chap_sof_3',
    workspace_id: 'ws_ait24',
    game_id: 'game_sof',
    chapter_number: 3,
    title: 'Explorando las Cuevas Profundas',
    status: 'in_progress',
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  }
];

const now = new Date();
const inTwoHours = new Date(now.getTime() + 2 * 3600 * 1000).toISOString();
const yesterday = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
const inThreeDays = new Date(now.getTime() + 3 * 24 * 3600 * 1000).toISOString();
const pastThreeDays = new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString();

export const INITIAL_STREAMS: TwitchStream[] = [
  {
    id: 'stream_sof_3',
    workspace_id: 'ws_ait24',
    game_id: 'game_sof',
    chapter_id: 'chap_sof_3',
    title: 'Sons of the Forest - Capítulo 3: Explorando las Cuevas',
    description: 'Buscando la pistola de tirolina y la pala en directo.',
    scheduled_start: inTwoHours,
    participant_user_ids: ['usr_demo_1', 'usr_mod_4'],
    status: 'scheduled',
    channel_url: 'https://twitch.tv/ait24',
    notes: 'Revisar la configuración del micrófono de ambiente.',
    created_at: new Date().toISOString()
  },
  {
    id: 'stream_ash_1',
    workspace_id: 'ws_ait24',
    game_id: 'game_ash',
    title: 'A Short Hike - Relaxing Gameplay Completo',
    description: 'Pasamos un rato chill consiguiendo plumas doradas.',
    scheduled_start: inThreeDays,
    participant_user_ids: ['usr_demo_1'],
    status: 'scheduled',
    channel_url: 'https://twitch.tv/ait24',
    created_at: new Date().toISOString()
  },
  {
    id: 'stream_sof_2',
    workspace_id: 'ws_ait24',
    game_id: 'game_sof',
    chapter_id: 'chap_sof_2',
    title: 'Sons of the Forest - Capítulo 2: El Búnker',
    scheduled_start: yesterday,
    actual_start: yesterday,
    actual_end: new Date(new Date(yesterday).getTime() + 3 * 3600 * 1000).toISOString(),
    duration_minutes: 180,
    participant_user_ids: ['usr_demo_1'],
    status: 'finished',
    channel_url: 'https://twitch.tv/ait24',
    created_at: yesterday
  }
];

export const INITIAL_VIDEOS: YouTubeVideo[] = [
  {
    id: 'vid_mc_10',
    workspace_id: 'ws_ait24',
    game_id: 'game_mc',
    title: 'Minecraft Survival #10 - Megabase Bajo el Agua',
    description: 'Terminamos la cúpula de cristal y la granja automatizada.',
    scheduled_publish: pastThreeDays,
    thumbnail_artist_id: 'usr_thumb_3',
    editor_id: 'usr_editor_2',
    thumbnail_completed: true,
    editing_completed: false,
    status: 'delayed',
    notes: 'Falta renderizar los efectos de sonido finales.',
    created_at: pastThreeDays
  },
  {
    id: 'vid_sof_2',
    workspace_id: 'ws_ait24',
    game_id: 'game_sof',
    chapter_id: 'chap_sof_2',
    twitch_stream_id: 'stream_sof_2',
    title: 'Sons of the Forest - Cap 2: EL BÚNKER SECRETO',
    description: 'Resumen editado de lo mejor del directo.',
    scheduled_publish: inThreeDays,
    thumbnail_artist_id: 'usr_thumb_3',
    editor_id: 'usr_editor_2',
    thumbnail_completed: true,
    editing_completed: false,
    status: 'in_preparation',
    created_at: new Date().toISOString()
  },
  {
    id: 'vid_ash_1',
    workspace_id: 'ws_ait24',
    game_id: 'game_ash',
    title: 'A Short Hike - Gameplay Completo en Español',
    scheduled_publish: new Date(now.getTime() + 5 * 24 * 3600 * 1000).toISOString(),
    thumbnail_artist_id: 'usr_thumb_3',
    editor_id: 'usr_editor_2',
    thumbnail_completed: true,
    editing_completed: true,
    status: 'ready_to_upload',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    workspace_id: 'ws_ait24',
    title: 'Miniatura para Sons of the Forest Cap 2',
    assigned_user_id: 'usr_thumb_3',
    status: 'completed',
    type: 'thumbnail',
    video_id: 'vid_sof_2',
    created_at: new Date().toISOString()
  },
  {
    id: 'task_2',
    workspace_id: 'ws_ait24',
    title: 'Edición de vídeo Sons of the Forest Cap 2',
    assigned_user_id: 'usr_editor_2',
    status: 'in_progress',
    type: 'editing',
    video_id: 'vid_sof_2',
    due_date: inThreeDays,
    created_at: new Date().toISOString()
  },
  {
    id: 'task_3',
    workspace_id: 'ws_ait24',
    title: 'Edición de Minecraft Survival #10',
    assigned_user_id: 'usr_editor_2',
    status: 'in_progress',
    type: 'editing',
    video_id: 'vid_mc_10',
    due_date: pastThreeDays,
    created_at: pastThreeDays
  },
  {
    id: 'task_4',
    workspace_id: 'ws_ait24',
    title: 'Preparar overlays de Twitch para directo',
    assigned_user_id: 'usr_demo_1',
    status: 'pending',
    type: 'general',
    due_date: inTwoHours,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    workspace_id: 'ws_ait24',
    user_id: 'usr_demo_1',
    type: 'video_delayed',
    title: 'Vídeo Retrasado',
    message: 'El vídeo "Minecraft Survival #10" ha superado la fecha prevista de publicación.',
    read: false,
    link: '/videos',
    created_at: pastThreeDays
  },
  {
    id: 'notif_2',
    workspace_id: 'ws_ait24',
    user_id: 'usr_demo_1',
    type: 'task_completed',
    title: 'Tarea Completada',
    message: '@elenagfx ha completado la miniatura de Sons of the Forest Cap 2.',
    read: true,
    link: '/tasks',
    created_at: yesterday
  }
];

export const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: 'integ_twitch',
    workspace_id: 'ws_ait24',
    platform: 'twitch',
    connected: true,
    channel_name: 'ait24_tv',
    last_sync: new Date().toISOString()
  },
  {
    id: 'integ_youtube',
    workspace_id: 'ws_ait24',
    platform: 'youtube',
    connected: true,
    channel_name: 'AIT24 Official',
    last_sync: new Date().toISOString()
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log_1',
    workspace_id: 'ws_ait24',
    action: 'Directo programado: Sons of the Forest - Capítulo 3',
    user_name: 'Alex Rivera (@alexrivera)',
    is_system: false,
    affected_entity: 'Directos',
    created_at: new Date().toISOString()
  },
  {
    id: 'log_2',
    workspace_id: 'ws_ait24',
    action: 'Sincronización con Twitch completada exitosamente',
    user_name: 'Sistema StreamFlow',
    is_system: true,
    affected_entity: 'Integración Twitch',
    created_at: new Date().toISOString()
  }
];

class Store {
  private listeners: Array<() => void> = [];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem('sf_user')) {
      localStorage.setItem('sf_user', JSON.stringify(INITIAL_USER));
    }
    if (!localStorage.getItem('sf_workspaces')) {
      localStorage.setItem('sf_workspaces', JSON.stringify(INITIAL_WORKSPACES));
    }
    if (!localStorage.getItem('sf_members')) {
      localStorage.setItem('sf_members', JSON.stringify(INITIAL_WORKSPACE_MEMBERS));
    }
    if (!localStorage.getItem('sf_all_users')) {
      localStorage.setItem('sf_all_users', JSON.stringify(INITIAL_MEMBERS_USERS));
    }
    if (!localStorage.getItem('sf_games')) {
      localStorage.setItem('sf_games', JSON.stringify(INITIAL_GAMES));
    }
    if (!localStorage.getItem('sf_chapters')) {
      localStorage.setItem('sf_chapters', JSON.stringify(INITIAL_CHAPTERS));
    }
    if (!localStorage.getItem('sf_streams')) {
      localStorage.setItem('sf_streams', JSON.stringify(INITIAL_STREAMS));
    }
    if (!localStorage.getItem('sf_videos')) {
      localStorage.setItem('sf_videos', JSON.stringify(INITIAL_VIDEOS));
    }
    if (!localStorage.getItem('sf_tasks')) {
      localStorage.setItem('sf_tasks', JSON.stringify(INITIAL_TASKS));
    }
    if (!localStorage.getItem('sf_notifications')) {
      localStorage.setItem('sf_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem('sf_integrations')) {
      localStorage.setItem('sf_integrations', JSON.stringify(INITIAL_INTEGRATIONS));
    }
    if (!localStorage.getItem('sf_activity')) {
      localStorage.setItem('sf_activity', JSON.stringify(INITIAL_ACTIVITY_LOGS));
    }
    if (!localStorage.getItem('sf_invitations')) {
      localStorage.setItem('sf_invitations', JSON.stringify([]));
    }
    if (!localStorage.getItem('sf_current_ws_id')) {
      localStorage.setItem('sf_current_ws_id', INITIAL_WORKSPACES[0].id);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // User
  public getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('sf_user') || JSON.stringify(INITIAL_USER));
  }
  public updateUser(user: User) {
    localStorage.setItem('sf_user', JSON.stringify(user));
    this.notify();
  }

  // Workspaces
  public getWorkspaces(): Workspace[] {
    return JSON.parse(localStorage.getItem('sf_workspaces') || '[]');
  }
  public getCurrentWorkspaceId(): string {
    return localStorage.getItem('sf_current_ws_id') || INITIAL_WORKSPACES[0].id;
  }
  public setCurrentWorkspaceId(id: string) {
    localStorage.setItem('sf_current_ws_id', id);
    this.notify();
  }
  public getCurrentWorkspace(): Workspace {
    const wsList = this.getWorkspaces();
    const currentId = this.getCurrentWorkspaceId();
    return wsList.find(w => w.id === currentId) || wsList[0] || INITIAL_WORKSPACES[0];
  }
  public addWorkspace(ws: Workspace) {
    const wsList = this.getWorkspaces();
    const idx = wsList.findIndex(w => w.id === ws.id);
    if (idx !== -1) {
      wsList[idx] = ws;
    } else {
      wsList.push(ws);
    }
    localStorage.setItem('sf_workspaces', JSON.stringify(wsList));
    this.notify();
  }

  // Workspace Members
  public getMembers(workspaceId: string): WorkspaceMember[] {
    const members: WorkspaceMember[] = JSON.parse(localStorage.getItem('sf_members') || '[]');
    return members.filter(m => m.workspace_id === workspaceId);
  }
  public addMember(member: WorkspaceMember) {
    const members: WorkspaceMember[] = JSON.parse(localStorage.getItem('sf_members') || '[]');
    members.push(member);
    localStorage.setItem('sf_members', JSON.stringify(members));
    this.notify();
  }
  public updateMemberRole(memberId: string, newRole: any) {
    const members: WorkspaceMember[] = JSON.parse(localStorage.getItem('sf_members') || '[]');
    const idx = members.findIndex(m => m.id === memberId);
    if (idx !== -1) {
      members[idx].role = newRole;
      localStorage.setItem('sf_members', JSON.stringify(members));
      this.notify();
    }
  }

  // Invitations
  public getInvitations(workspaceId?: string): Invitation[] {
    const invs: Invitation[] = JSON.parse(localStorage.getItem('sf_invitations') || '[]');
    if (workspaceId) {
      return invs.filter(i => i.workspace_id === workspaceId);
    }
    return invs;
  }
  public addInvitation(invitation: Invitation) {
    const invs = this.getInvitations();
    invs.push(invitation);
    localStorage.setItem('sf_invitations', JSON.stringify(invs));
    this.notify();
  }
  public updateInvitationStatus(invitationId: string, status: 'accepted' | 'rejected' | 'cancelled') {
    const invs = this.getInvitations();
    const idx = invs.findIndex(i => i.id === invitationId);
    if (idx !== -1) {
      invs[idx].status = status;
      localStorage.setItem('sf_invitations', JSON.stringify(invs));

      if (status === 'accepted') {
        const inv = invs[idx];
        const allUsers: User[] = JSON.parse(localStorage.getItem('sf_all_users') || '[]');
        const user = allUsers.find(u => u.username.toLowerCase() === inv.invited_username.toLowerCase()) || this.getCurrentUser();
        this.addMember({
          id: 'wm_' + Date.now(),
          workspace_id: inv.workspace_id,
          user_id: user.id,
          role: inv.role,
          joined_at: new Date().toISOString(),
          user
        });
      }
      this.notify();
    }
  }

  // Games
  public getGames(workspaceId: string): Game[] {
    const games: Game[] = JSON.parse(localStorage.getItem('sf_games') || '[]');
    return games.filter(g => g.workspace_id === workspaceId);
  }
  public addGame(game: Game) {
    const games: Game[] = JSON.parse(localStorage.getItem('sf_games') || '[]');
    games.push(game);
    localStorage.setItem('sf_games', JSON.stringify(games));
    this.notify();
  }
  public updateGame(game: Game) {
    const games: Game[] = JSON.parse(localStorage.getItem('sf_games') || '[]');
    const idx = games.findIndex(g => g.id === game.id);
    if (idx !== -1) {
      games[idx] = game;
      localStorage.setItem('sf_games', JSON.stringify(games));
      this.notify();
    }
  }

  // Chapters
  public getChapters(workspaceId: string, gameId?: string): Chapter[] {
    const chapters: Chapter[] = JSON.parse(localStorage.getItem('sf_chapters') || '[]');
    const filtered = chapters.filter(c => c.workspace_id === workspaceId);
    if (gameId) return filtered.filter(c => c.game_id === gameId);
    return filtered;
  }
  public addChapter(chapter: Chapter) {
    const chapters: Chapter[] = JSON.parse(localStorage.getItem('sf_chapters') || '[]');
    chapters.push(chapter);
    localStorage.setItem('sf_chapters', JSON.stringify(chapters));

    const games = this.getGames(chapter.workspace_id);
    const game = games.find(g => g.id === chapter.game_id);
    if (game && game.type === 'series') {
      game.current_chapter = Math.max(game.current_chapter || 0, chapter.chapter_number);
      game.next_chapter_suggested = (game.current_chapter || 0) + 1;
      this.updateGame(game);
    }

    this.notify();
  }

  // Streams
  public getStreams(workspaceId: string): TwitchStream[] {
    const streams: TwitchStream[] = JSON.parse(localStorage.getItem('sf_streams') || '[]');
    return streams.filter(s => s.workspace_id === workspaceId);
  }
  public addStream(stream: TwitchStream) {
    const streams: TwitchStream[] = JSON.parse(localStorage.getItem('sf_streams') || '[]');
    streams.push(stream);
    localStorage.setItem('sf_streams', JSON.stringify(streams));
    this.notify();
  }
  public updateStream(stream: TwitchStream) {
    const streams: TwitchStream[] = JSON.parse(localStorage.getItem('sf_streams') || '[]');
    const idx = streams.findIndex(s => s.id === stream.id);
    if (idx !== -1) {
      streams[idx] = stream;
      localStorage.setItem('sf_streams', JSON.stringify(streams));
      this.notify();
    }
  }

  // Videos
  public getVideos(workspaceId: string): YouTubeVideo[] {
    const videos: YouTubeVideo[] = JSON.parse(localStorage.getItem('sf_videos') || '[]');
    return videos.filter(v => v.workspace_id === workspaceId);
  }
  public addVideo(video: YouTubeVideo) {
    const videos: YouTubeVideo[] = JSON.parse(localStorage.getItem('sf_videos') || '[]');
    videos.push(video);
    localStorage.setItem('sf_videos', JSON.stringify(videos));

    this.addTask({
      id: 'task_' + Date.now() + '_thumb',
      workspace_id: video.workspace_id,
      title: `Miniatura para: ${video.title}`,
      assigned_user_id: video.thumbnail_artist_id,
      status: video.thumbnail_completed ? 'completed' : 'pending',
      type: 'thumbnail',
      video_id: video.id,
      created_at: new Date().toISOString()
    });

    this.addTask({
      id: 'task_' + Date.now() + '_edit',
      workspace_id: video.workspace_id,
      title: `Edición de vídeo: ${video.title}`,
      assigned_user_id: video.editor_id,
      status: video.editing_completed ? 'completed' : 'pending',
      type: 'editing',
      video_id: video.id,
      due_date: video.scheduled_publish,
      created_at: new Date().toISOString()
    });

    this.notify();
  }
  public updateVideo(video: YouTubeVideo) {
    const videos: YouTubeVideo[] = JSON.parse(localStorage.getItem('sf_videos') || '[]');
    const idx = videos.findIndex(v => v.id === video.id);
    if (idx !== -1) {
      if (video.thumbnail_completed && video.editing_completed) {
        if (['pending', 'in_preparation'].includes(video.status)) {
          video.status = 'ready_to_upload';
        }
      } else if (video.thumbnail_completed || video.editing_completed) {
        if (['pending', 'ready_to_upload'].includes(video.status)) {
          video.status = 'in_preparation';
        }
      } else {
        if (['in_preparation', 'ready_to_upload'].includes(video.status)) {
          video.status = 'pending';
        }
      }

      videos[idx] = video;
      localStorage.setItem('sf_videos', JSON.stringify(videos));

      // Keep tasks synced with video state changes
      const tasks: Task[] = JSON.parse(localStorage.getItem('sf_tasks') || '[]');
      let tasksUpdated = false;
      tasks.forEach(t => {
        if (t.video_id === video.id) {
          if (t.type === 'thumbnail' && (t.status === 'completed') !== video.thumbnail_completed) {
            t.status = video.thumbnail_completed ? 'completed' : 'pending';
            tasksUpdated = true;
          }
          if (t.type === 'editing' && (t.status === 'completed') !== video.editing_completed) {
            t.status = video.editing_completed ? 'completed' : 'pending';
            tasksUpdated = true;
          }
        }
      });
      if (tasksUpdated) {
        localStorage.setItem('sf_tasks', JSON.stringify(tasks));
      }

      this.notify();
    }
  }

  // Tasks
  public getTasks(workspaceId: string): Task[] {
    const tasks: Task[] = JSON.parse(localStorage.getItem('sf_tasks') || '[]');
    return tasks.filter(t => t.workspace_id === workspaceId);
  }
  public addTask(task: Task) {
    const tasks: Task[] = JSON.parse(localStorage.getItem('sf_tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('sf_tasks', JSON.stringify(tasks));
    this.notify();
  }
  public updateTask(task: Task) {
    const tasks: Task[] = JSON.parse(localStorage.getItem('sf_tasks') || '[]');
    const idx = tasks.findIndex(t => t.id === task.id);
    if (idx !== -1) {
      tasks[idx] = task;
      localStorage.setItem('sf_tasks', JSON.stringify(tasks));

      if (task.video_id) {
        const videos = this.getVideos(task.workspace_id);
        const video = videos.find(v => v.id === task.video_id);
        if (video) {
          if (task.type === 'thumbnail') {
            video.thumbnail_completed = (task.status === 'completed');
            this.updateVideo(video);
          } else if (task.type === 'editing') {
            video.editing_completed = (task.status === 'completed');
            this.updateVideo(video);
          }
        }
      }

      this.notify();
    }
  }

  // Notifications
  public getNotifications(workspaceId: string, userId: string): Notification[] {
    const notifs: Notification[] = JSON.parse(localStorage.getItem('sf_notifications') || '[]');
    return notifs.filter(n => n.workspace_id === workspaceId && n.user_id === userId);
  }
  public addNotification(notification: Notification) {
    const notifs: Notification[] = JSON.parse(localStorage.getItem('sf_notifications') || '[]');
    notifs.push(notification);
    localStorage.setItem('sf_notifications', JSON.stringify(notifs));
    this.notify();
  }
  public markNotificationAsRead(id: string) {
    const notifs: Notification[] = JSON.parse(localStorage.getItem('sf_notifications') || '[]');
    const idx = notifs.findIndex(n => n.id === id);
    if (idx !== -1) {
      notifs[idx].read = true;
      localStorage.setItem('sf_notifications', JSON.stringify(notifs));
      this.notify();
    }
  }

  // Integrations
  public getIntegrations(workspaceId: string): Integration[] {
    const integs: Integration[] = JSON.parse(localStorage.getItem('sf_integrations') || '[]');
    return integs.filter(i => i.workspace_id === workspaceId);
  }
  public updateIntegration(integration: Integration) {
    const integs: Integration[] = JSON.parse(localStorage.getItem('sf_integrations') || '[]');
    const idx = integs.findIndex(i => i.id === integration.id);
    if (idx !== -1) {
      integs[idx] = integration;
      localStorage.setItem('sf_integrations', JSON.stringify(integs));
      this.notify();
    }
  }

  // Activity Log
  public getActivityLogs(workspaceId: string): ActivityLog[] {
    const logs: ActivityLog[] = JSON.parse(localStorage.getItem('sf_activity') || '[]');
    return logs.filter(l => l.workspace_id === workspaceId);
  }
  public logActivity(log: ActivityLog) {
    const logs: ActivityLog[] = JSON.parse(localStorage.getItem('sf_activity') || '[]');
    logs.unshift(log);
    localStorage.setItem('sf_activity', JSON.stringify(logs));
    this.notify();
  }
}

export const store = new Store();
