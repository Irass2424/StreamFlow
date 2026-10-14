export type UserRole = 'admin' | 'moderator' | 'editor' | 'thumbnail_artist' | 'custom';

export interface User {
  id: string;
  name: string;
  username: string; // Format @username
  email: string;
  avatar_url: string;
  google_connected: boolean;
  notification_preferences: {
    email: boolean;
    app: boolean;
    reminders: boolean;
  };
  appearance_preferences: {
    theme: 'dark' | 'light' | 'system';
    compact_sidebar: boolean;
  };
  privacy_settings: {
    show_online_status: boolean;
  };
}

export interface Workspace {
  id: string;
  name: string;
  logo_url: string;
  description?: string;
  owner_id: string;
  created_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
  user?: User;
}

export interface Invitation {
  id: string;
  workspace_id: string;
  invited_username: string;
  invited_by_user_id: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at: string;
}

export type GameType = 'series' | 'standalone' | 'continuous';

export type GameStatus = 'playing' | 'upcoming' | 'paused' | 'completed';

export interface Game {
  id: string;
  workspace_id: string;
  name: string;
  cover_url: string;
  status: GameStatus;
  type: GameType;
  current_chapter?: number;
  next_chapter_suggested?: number;
  notes?: string;
  created_at: string;
}

export interface Chapter {
  id: string;
  workspace_id: string;
  game_id: string;
  chapter_number: number;
  title: string;
  is_final_chapter?: boolean;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
}

export type TwitchStreamStatus =
  | 'scheduled'
  | 'preparing'
  | 'live'
  | 'finished'
  | 'cancelled'
  | 'delayed';

export interface TwitchStream {
  id: string;
  workspace_id: string;
  game_id?: string;
  chapter_id?: string;
  title: string;
  description?: string;
  scheduled_start: string;
  actual_start?: string;
  actual_end?: string;
  duration_minutes?: number;
  participant_user_ids: string[];
  notes?: string;
  channel_url?: string;
  status: TwitchStreamStatus;
  created_at: string;
}

export type YouTubeVideoStatus =
  | 'pending'
  | 'in_preparation'
  | 'ready_to_upload'
  | 'uploaded'
  | 'scheduled'
  | 'delayed'
  | 'published'
  | 'cancelled';

export interface YouTubeVideo {
  id: string;
  workspace_id: string;
  game_id?: string;
  chapter_id?: string;
  twitch_stream_id?: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  scheduled_publish: string;
  actual_publish?: string;
  editor_id?: string;
  thumbnail_artist_id?: string;
  thumbnail_completed: boolean;
  editing_completed: boolean;
  video_url?: string;
  notes?: string;
  status: YouTubeVideoStatus;
  created_at: string;
}

export interface Task {
  id: string;
  workspace_id: string;
  title: string;
  assigned_user_id?: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  video_id?: string;
  stream_id?: string;
  type: 'thumbnail' | 'editing' | 'general';
  created_at: string;
}

export type NotificationType =
  | 'invitation'
  | 'task_assigned'
  | 'task_completed'
  | 'event_changed'
  | 'stream_reminder'
  | 'stream_started'
  | 'stream_ended'
  | 'video_ready'
  | 'video_delayed'
  | 'video_published'
  | 'integration_error';

export interface Notification {
  id: string;
  workspace_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  created_at: string;
}

export interface Integration {
  id: string;
  workspace_id: string;
  platform: 'twitch' | 'youtube';
  connected: boolean;
  channel_name?: string;
  last_sync?: string;
  error_message?: string;
}

export interface ActivityLog {
  id: string;
  workspace_id: string;
  action: string;
  user_id?: string;
  user_name: string;
  is_system: boolean;
  affected_entity?: string;
  created_at: string;
}
