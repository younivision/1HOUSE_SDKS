import { useState, useCallback } from 'react';

interface ImageCacheEntry {
  url: string;
  blob?: Blob;
  loading: boolean;
  error?: string;
}

const imageCache = new Map<string, ImageCacheEntry>();

export function useImageCache() {
  const [, forceUpdate] = useState({});

  const getCachedImage = useCallback((url: string): string => {
    if (!url) return '';

    // Check if already cached
    const cached = imageCache.get(url);
    if (cached?.blob) {
      return URL.createObjectURL(cached.blob);
    }

    // Start loading if not already
    if (!cached || (!cached.loading && !cached.error)) {
      loadImage(url);
    }

    return url; // Return original URL while loading
  }, []);

  const loadImage = async (url: string) => {
    imageCache.set(url, { url, loading: true });
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load image');
      
      const blob = await response.blob();
      imageCache.set(url, { url, blob, loading: false });
      forceUpdate({}); // Trigger re-render
    } catch (error) {
      console.error('Error loading image:', error);
      imageCache.set(url, { 
        url, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const preloadImage = useCallback((url: string) => {
    if (!imageCache.has(url)) {
      loadImage(url);
    }
  }, []);

  const clearCache = useCallback(() => {
    // Revoke all object URLs
    imageCache.forEach(entry => {
      if (entry.blob) {
        URL.revokeObjectURL(URL.createObjectURL(entry.blob));
      }
    });
    imageCache.clear();
    forceUpdate({});
  }, []);

  return {
    getCachedImage,
    preloadImage,
    clearCache,
  };
}

