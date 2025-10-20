import React from 'react';
import { User } from '../types';
import { useImageCache } from '../hooks/useImageCache';

interface UserListProps {
  users: User[];
  theme?: 'light' | 'dark';
  customStyles?: any;
  currentUserId?: string;
  isAdmin?: boolean;
  onBanUser?: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ 
  users, 
  theme = 'dark',
  customStyles,
  currentUserId,
  isAdmin = false,
  onBanUser
}) => {
  const { getCachedImage } = useImageCache();

  return (
    <div className="p-3" style={customStyles}>
      <h4 className="m-0 mb-3 text-xs font-semibold font-display uppercase tracking-wider opacity-70">
        Online ({users.length})
      </h4>
      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <div 
            key={user.userId} 
            className={`group flex items-center gap-2 p-1 rounded transition-colors ${
              theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'
            }`}
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
              {user.avatar ? (
                <img 
                  src={getCachedImage(user.avatar)} 
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center font-semibold text-[11px] font-sans text-white"
                  style={{ backgroundColor: user.color }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-[13px] font-sans overflow-hidden text-ellipsis whitespace-nowrap flex-1">
              {user.username}
            </span>
            {user.role && user.role !== 'user' && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${
                user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {user.role}
              </span>
            )}
            {isAdmin && user.userId !== currentUserId && user.role !== 'admin' && (
              <button
                onClick={() => onBanUser?.(user.userId)}
                className={`opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-1.5 py-0.5 rounded ${
                  theme === 'dark'
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                    : 'bg-red-100 hover:bg-red-200 text-red-600'
                }`}
                title="Ban user"
              >
                🚫
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
