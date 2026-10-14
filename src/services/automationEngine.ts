import { store } from './store';
import type { TwitchStream, YouTubeVideo } from '../types';

export class AutomationEngine {
  private timer: any = null;

  public start() {
    if (this.timer) return;
    this.checkAutomations();
    this.timer = setInterval(() => {
      this.checkAutomations();
    }, 30000);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public checkAutomations() {
    const ws = store.getCurrentWorkspace();
    if (!ws) return;

    const now = new Date();
    const nowMs = now.getTime();

    const streams = store.getStreams(ws.id);
    streams.forEach(stream => {
      if (stream.status === 'scheduled') {
        const schedMs = new Date(stream.scheduled_start).getTime();
        const diffMinutes = (schedMs - nowMs) / (1000 * 60);

        if (diffMinutes <= 30 && diffMinutes > 0) {
          const updated: TwitchStream = {
            ...stream,
            status: 'preparing'
          };
          store.updateStream(updated);
          store.logActivity({
            id: 'log_' + Date.now(),
            workspace_id: ws.id,
            action: `Cambio automático de estado a PREPARANDO (30 min antes): ${stream.title}`,
            user_name: 'Sistema StreamFlow',
            is_system: true,
            affected_entity: 'Directos',
            created_at: new Date().toISOString()
          });
        }
        else if (diffMinutes <= 0) {
          const updated: TwitchStream = {
            ...stream,
            status: 'delayed'
          };
          store.updateStream(updated);
          store.logActivity({
            id: 'log_' + Date.now(),
            workspace_id: ws.id,
            action: `Directo retrasado detectado: ${stream.title}`,
            user_name: 'Sistema StreamFlow',
            is_system: true,
            affected_entity: 'Directos',
            created_at: new Date().toISOString()
          });
        }
      }
    });

    const videos = store.getVideos(ws.id);
    videos.forEach(video => {
      if (!['published', 'cancelled', 'delayed'].includes(video.status)) {
        const pubMs = new Date(video.scheduled_publish).getTime();
        if (nowMs > pubMs) {
          const updated: YouTubeVideo = {
            ...video,
            status: 'delayed'
          };
          store.updateVideo(updated);
          store.logActivity({
            id: 'log_' + Date.now(),
            workspace_id: ws.id,
            action: `Vídeo de YouTube retrasado detectado: ${video.title}`,
            user_name: 'Sistema StreamFlow',
            is_system: true,
            affected_entity: 'Vídeos YouTube',
            created_at: new Date().toISOString()
          });

          const currentUser = store.getCurrentUser();
          store.addNotification({
            id: 'notif_' + Date.now() + '_' + video.id,
            workspace_id: ws.id,
            user_id: currentUser.id,
            type: 'video_delayed',
            title: '🔴 Publicación Retrasada',
            message: `El vídeo "${video.title}" ha superado su hora programada de publicación sin confirmación.`,
            read: false,
            link: '/videos',
            created_at: new Date().toISOString()
          });
        }
      }
    });
  }
}

export const automationEngine = new AutomationEngine();
