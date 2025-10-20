import { useState, useCallback, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

interface ImageCacheEntry {
  url: string;
  localUri?: string;
  loading: boolean;
  error?: string;
}

const imageCache = new Map<string, ImageCacheEntry>();
const CACHE_DIR = `${FileSystem.cacheDirectory}chat-images/`;

export function useImageCache() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Ensure cache directory exists
    FileSystem.getInfoAsync(CACHE_DIR).then((info) => {
      if (!info.exists) {
        FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
      }
    });
  }, []);

  const getCachedImage = useCallback((url: string): string => {
    if (!url) return '';

    // Check if already cached
    const cached = imageCache.get(url);
    if (cached?.localUri) {
      return cached.localUri;
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
      // Create a hash of the URL for the filename
      const filename = url.split('/').pop() || `${Date.now()}.jpg`;
      const localUri = `${CACHE_DIR}${filename}`;

      // Check if already downloaded
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      
      if (fileInfo.exists) {
        imageCache.set(url, { url, localUri, loading: false });
        forceUpdate({});
        return;
      }

      // Download the image
      const downloadResult = await FileSystem.downloadAsync(url, localUri);
      
      if (downloadResult.status === 200) {
        imageCache.set(url, { url, localUri: downloadResult.uri, loading: false });
        forceUpdate({});
      } else {
        throw new Error('Failed to download image');
      }
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

  const clearCache = useCallback(async () => {
    try {
      await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
      imageCache.clear();
      forceUpdate({});
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, []);

  const getCacheSize = useCallback(async (): Promise<number> => {
    try {
      const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
      let totalSize = 0;
      
      for (const file of files) {
        const info = await FileSystem.getInfoAsync(`${CACHE_DIR}${file}`);
        if (info.exists && 'size' in info) {
          totalSize += info.size || 0;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  }, []);

  return {
    getCachedImage,
    preloadImage,
    clearCache,
    getCacheSize,
  };
}

