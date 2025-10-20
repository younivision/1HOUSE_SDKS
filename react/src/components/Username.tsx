import React from 'react';
import { useUserDetails } from '../hooks/useUserDetails';

interface UsernameProps {
  userId: string;
  fallbackUsername?: string;
  fallbackColor?: string;
  className?: string;
  showBadge?: boolean;
  userDetailsApi?: {
    endpoint: string;
    apiKey: string;
    cacheDuration?: number;
    enabled?: boolean;
  };
}

export const Username: React.FC<UsernameProps> = ({
  userId,
  fallbackUsername,
  fallbackColor,
  className = '',
  showBadge = false,
  userDetailsApi,
}) => {
  const { userDetails, loading } = useUserDetails(userId, {
    apiEndpoint: userDetailsApi?.endpoint || '',
    apiKey: userDetailsApi?.apiKey || '',
    cacheDuration: userDetailsApi?.cacheDuration,
    enabled: userDetailsApi?.enabled !== false && !!userDetailsApi?.endpoint,
  });

  const username = userDetails?.username || userDetails?.displayName || fallbackUsername || 'User';
  const role = userDetails?.role;

  if (loading && !fallbackUsername) {
    return (
      <span className={`inline-block h-4 w-20 bg-gray-300 animate-pulse rounded ${className}`} />
    );
  }

  return (
    <span className={className} style={{ color: fallbackColor }}>
      {username}
      {showBadge && role && role !== 'user' && (
        <span 
          className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${
            role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
          }`}
        >
          {role}
        </span>
      )}
    </span>
  );
};

