import { Track, Source } from '../types';

const API_BASE_URL = 'https://kailash-api.vercel.app';

export const apiService = {
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
        // Saavn provides streamUrl directly; YouTube does not
        streamUrl: item.streamUrl || null,
      }));
    } catch (error) {
      console.error('[API] Search Error:', error);
      return [];
    }
  },

  async getStreamUrl(id: string, source: Source): Promise<string | null> {
    try {
      if (source === 'jiosaavn') {
        // Saavn streamUrl comes directly from search results.
        // If you only have the id here, there's nothing to resolve.
        // Pass the streamUrl through /api/saavn/stream proxy instead:
        // return `${API_BASE_URL}/saavn/stream?url=${encodeURIComponent(id)}`;
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/stream?id=${id}`);
      if (!response.ok) throw new Error('Stream resolution failed');
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('[API] Stream Error:', error);
      // Fallback: proxy endpoint
      return `${API_BASE_URL}/stream/proxy?id=${id}`;
    }
  },

  // Use this when you have a Saavn CDN streamUrl from search results
  getSaavnProxyUrl(streamUrl: string): string {
    return `${API_BASE_URL}/saavn/stream?url=${encodeURIComponent(streamUrl)}`;
  },

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
        source: 'youtube' as Source,
      }));
    } catch (error) {
      console.error('[API] Suggestions Error:', error);
      return [];
    }
  },
};