import { useState, useEffect, useCallback } from 'react';

export interface UserDetails {
  id: string;
  username: string;
  avatar?: string;
  displayName?: string;
  bio?: string;
  role?: string;
  [key: string]: any; // Allow additional fields
}

interface UserDetailsCache {
  data: UserDetails;
  timestamp: number;
  loading: boolean;
}

interface UseUserDetailsConfig {
  apiEndpoint: string;
  apiKey: string;
  cacheDuration?: number; // in milliseconds, default 5 minutes
  enabled?: boolean;
}

const userDetailsCache = new Map<string, UserDetailsCache>();
const pendingRequests = new Map<string, Promise<UserDetails>>();

export function useUserDetails(
  userId: string,
  config: UseUserDetailsConfig
) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    apiEndpoint,
    apiKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
  } = config;

  const fetchUserDetails = useCallback(async (userId: string, force = false): Promise<UserDetails> => {
    // Check cache first
    const cached = userDetailsCache.get(userId);
    const now = Date.now();
    
    if (!force && cached && (now - cached.timestamp) < cacheDuration) {
      return cached.data;
    }

    // Check if there's already a pending request for this user
    const pending = pendingRequests.get(userId);
    if (pending) {
      return pending;
    }

    // Create new request
    const requestPromise = (async () => {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey,
          },
          body: JSON.stringify({ id: userId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Cache the result
        userDetailsCache.set(userId, {
          data,
          timestamp: Date.now(),
          loading: false,
        });

        // Remove from pending
        pendingRequests.delete(userId);
        
        return data;
      } catch (err) {
        pendingRequests.delete(userId);
        throw err;
      }
    })();

    // Store pending request
    pendingRequests.set(userId, requestPromise);
    
    return requestPromise;
  }, [apiEndpoint, apiKey, cacheDuration]);

  useEffect(() => {
    if (!enabled || !userId) {
      return;
    }

    let isMounted = true;

    const loadUserDetails = async () => {
      // Check cache immediately
      const cached = userDetailsCache.get(userId);
      if (cached && (Date.now() - cached.timestamp) < cacheDuration) {
        if (isMounted) {
          setUserDetails(cached.data);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const details = await fetchUserDetails(userId);
        if (isMounted) {
          setUserDetails(details);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch user details');
          setLoading(false);
        }
      }
    };

    loadUserDetails();

    return () => {
      isMounted = false;
    };
  }, [userId, enabled, fetchUserDetails, cacheDuration]);

  const refresh = useCallback(async () => {
    if (!userId || !enabled) return;
    
    setLoading(true);
    setError(null);

    try {
      const details = await fetchUserDetails(userId, true);
      setUserDetails(details);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      setLoading(false);
    }
  }, [userId, enabled, fetchUserDetails]);

  const clearCache = useCallback(() => {
    if (userId) {
      userDetailsCache.delete(userId);
    }
  }, [userId]);

  return {
    userDetails,
    loading,
    error,
    refresh,
    clearCache,
  };
}

// Batch fetch multiple users at once
export async function batchFetchUserDetails(
  userIds: string[],
  config: UseUserDetailsConfig
): Promise<Map<string, UserDetails>> {
  const { apiEndpoint, apiKey, cacheDuration = 5 * 60 * 1000 } = config;
  const results = new Map<string, UserDetails>();
  const toFetch: string[] = [];
  const now = Date.now();

  // Check cache first
  for (const userId of userIds) {
    const cached = userDetailsCache.get(userId);
    if (cached && (now - cached.timestamp) < cacheDuration) {
      results.set(userId, cached.data);
    } else {
      toFetch.push(userId);
    }
  }

  // Fetch remaining users
  if (toFetch.length > 0) {
    try {
      const promises = toFetch.map(async (userId) => {
        try {
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': apiKey,
            },
            body: JSON.stringify({ id: userId }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          // Cache the result
          userDetailsCache.set(userId, {
            data,
            timestamp: Date.now(),
            loading: false,
          });

          results.set(userId, data);
        } catch (err) {
          console.error(`Failed to fetch user details for ${userId}:`, err);
        }
      });

      await Promise.all(promises);
    } catch (err) {
      console.error('Batch fetch error:', err);
    }
  }

  return results;
}

// Clear all cached user details
export function clearAllUserDetailsCache() {
  userDetailsCache.clear();
  pendingRequests.clear();
}

// Clear specific user from cache
export function clearUserDetailsCache(userId: string) {
  userDetailsCache.delete(userId);
  pendingRequests.delete(userId);
}

// Get cached user details synchronously (returns null if not cached)
export function getCachedUserDetails(userId: string): UserDetails | null {
  const cached = userDetailsCache.get(userId);
  if (!cached) return null;
  
  // Check if cache is still valid (optional - you can remove this check for instant returns)
  // const now = Date.now();
  // if (now - cached.timestamp > cacheDuration) return null;
  
  return cached.data;
}

// Preload user details (fire and forget)
export function preloadUserDetails(userId: string, config: UseUserDetailsConfig) {
  const cached = userDetailsCache.get(userId);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < (config.cacheDuration || 5 * 60 * 1000)) {
    return; // Already cached
  }

  fetch(config.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': config.apiKey,
    },
    body: JSON.stringify({ id: userId }),
  })
    .then(response => response.json())
    .then(data => {
      userDetailsCache.set(userId, {
        data,
        timestamp: Date.now(),
        loading: false,
      });
    })
    .catch(err => {
      console.error(`Failed to preload user details for ${userId}:`, err);
    });
}

