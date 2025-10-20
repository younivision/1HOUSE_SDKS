import React from 'react';
import { useUserDetails } from '../hooks/useUserDetails';

interface UserAvatarProps {
  userId: string;
  fallbackUsername?: string;
  fallbackAvatar?: string;
  fallbackColor?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  userDetailsApi?: {
    endpoint: string;
    apiKey: string;
    cacheDuration?: number;
    enabled?: boolean;
  };
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  userId,
  fallbackUsername,
  fallbackAvatar,
  fallbackColor = '#6366f1',
  size = 'medium',
  className = '',
  userDetailsApi,
}) => {
  const { userDetails, loading } = useUserDetails(userId, {
    apiEndpoint: userDetailsApi?.endpoint || '',
    apiKey: userDetailsApi?.apiKey || '',
    cacheDuration: userDetailsApi?.cacheDuration,
    enabled: userDetailsApi?.enabled !== false && !!userDetailsApi?.endpoint,
  });

  const sizeClasses = {
    small: 'w-6 h-6 text-[11px]',
    medium: 'w-8 h-8 text-sm',
    large: 'w-12 h-12 text-lg',
  };

  const username = userDetails?.username || userDetails?.displayName || fallbackUsername || 'User';
  const avatar = userDetails?.avatar || fallbackAvatar;
  const initial = username.charAt(0).toUpperCase();

  if (loading && !fallbackAvatar && !fallbackUsername) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-full bg-gray-300 animate-pulse`} />
    );
  }

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={username}
        className={`${sizeClasses[size]} ${className} rounded-full object-cover`}
        onError={(e) => {
          // Fallback to initials if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${className} rounded-full flex items-center justify-center font-semibold font-sans text-white`}
      style={{ backgroundColor: fallbackColor }}
    >
      {initial}
    </div>
  );
};

