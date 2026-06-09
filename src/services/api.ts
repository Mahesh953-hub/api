import { Track, Source } from '../types';

const API_BASE_URL = 'https://apis.kailashhh.com/api';

/**
 * Streamify API Service
 * Handles interaction with the unified backend for search, streaming, and suggestions.
 */
export const apiService = {
  /**
   * Performs a multi-source search.
   * Recommended sources: 'ytv2' (YouTube) and 'saavn' (JioSaavn).
   */
  async search(query: string, source: Source = 'youtube', limit: number = 20): Promise<Track[]> {
    const activeSource = source === 'youtube' ? 'ytv2' : source;
    const url = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&source=${activeSource}&limit=${limit}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Search failed: ${response.statusText}`);
      const data = await response.json();
      
      return data.results.map((item: any) => ({
        id: item.id,
        title: item.title,
        artist: item.artist,
        thumbnail: item.thumbnail,
        duration: item.duration,
        source: item.source || activeSource,
        // For Saavn, the streamUrl is often provided directly in the search results
        streamUrl: item.streamUrl || null 
      }));
    } catch (error) {
      console.error('[API] Search Error:', error);
      return [];
    }
  },

  /**
   * Resolves a track ID to a direct audio stream URL.
   */
  async getStreamUrl(id: string, source: Source): Promise<string | null> {
    if (source === 'jiosaavn') {
      // Saavn URLs are usually in the result or need proxying
      // If we only have the ID, we'd need a specific saavn/details endpoint
      return null; 
    }

    try {
      const response = await fetch(`${API_BASE_URL}/stream?id=${id}`);
      if (!response.ok) throw new Error('Stream resolution failed');
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('[API] Stream Error:', error);
      // Fallback to proxy if direct stream fails
      return `${API_BASE_URL}/stream/proxy?id=${id}`;
    }
  },

  /**
   * Fetches "Up Next" suggestions for a given track.
   */
  async getSuggestions(id: string, limit: number = 10): Promise<Track[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/suggestions?id=${id}&limit=${limit}`);
      if (!response.ok) throw new Error('Suggestions failed');
      const data = await response.json();
      
      return data.suggestions.map((item: any) => ({
        id: item.id,
        title: item.title,
        artist: item.artist,
        thumbnail: item.thumbnail,
        duration: item.duration,
        source: 'youtube'
      }));
    } catch (error) {
      console.error('[API] Suggestions Error:', error);
      return [];
    }
  }
};
