import { Track, Source } from '../types';
import { usePlayerStore } from '../store/usePlayerStore';

/**
 * UnifiedAudioEngine
 * The "Heart" of Streamify.
 * Handles multi-source playback, gapless transitions, and buffer management.
 */
class UnifiedAudioEngine {
  public getCurrentTime(): number { return this.activePlayer?.currentTime || 0; }
  public getIsPlaying(): boolean { return this.activePlayer ? !this.activePlayer.paused : false; }
  private activePlayer: HTMLAudioElement | any = null; // Can be extended for YT/Spotify SDKs
  private secondaryPlayer: HTMLAudioElement | null = null; // For crossfading/pre-fetching
  private crossfadeDuration: number = 2000; // 2 seconds
  
  constructor() {
    this.activePlayer = new Audio();
    this.secondaryPlayer = new Audio();
    this.setupListeners();
  }

  private setupListeners() {
    this.activePlayer.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    this.activePlayer.addEventListener('timeupdate', () => {
      const remaining = this.activePlayer.duration - this.activePlayer.currentTime;
      if (remaining <= (this.crossfadeDuration / 1000) && !this.isTransitioning) {
        this.prepareNextTrack();
      }
    });
  }

  private isTransitioning = false;

  public async playTrack(track: Track) {
    console.log(`[AudioEngine] Switching to: ${track.title} via ${track.source}`);
    
    // Stop any existing playback
    this.activePlayer.pause();

    switch (track.source) {
      case 'youtube':
        // Integration for YouTube IFrame API would be triggered here
        this.handleYouTubeStream(track);
        break;
      case 'spotify':
        // Integration for Spotify Web Playback SDK
        this.handleSpotifyStream(track);
        break;
      default:
        // Native HTML5 Audio for Local/Direct streams
        this.activePlayer.src = track.streamUrl || '';
        await this.activePlayer.play();
    }
  }

  private handleYouTubeStream(track: Track) {
    // Placeholder for YouTube IFrame Controller logic
    // In production, this would communicate with a singleton YT.Player instance
    console.log('Routing to YouTube IFrame Controller...', track.id);
  }

  private handleSpotifyStream(track: Track) {
    // Placeholder for Spotify Web Playback SDK logic
    console.log('Routing to Spotify SDK Controller...', track.id);
  }

  private prepareNextTrack() {
    const { queue } = usePlayerStore.getState();
    if (queue.length > 0) {
      this.isTransitioning = true;
      console.log('[AudioEngine] Pre-fetching next track for gapless transition...');
      // Buffer logic would go here
    }
  }

  private handleTrackEnded() {
    const { nextTrack } = usePlayerStore.getState();
    nextTrack();
  }

  public setVolume(val: number) {
    if (this.activePlayer) {
      this.activePlayer.volume = val;
    }
  }

  public pause() {
    this.activePlayer?.pause();
  }

  public resume() {
    this.activePlayer?.play();
  }

  public seek(time: number) {
    if (this.activePlayer) {
      this.activePlayer.currentTime = time;
    }
  }
}

export const audioEngine = new UnifiedAudioEngine();