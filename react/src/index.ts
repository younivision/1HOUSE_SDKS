export { LiveChat } from './components/LiveChat';
export { TwitchStream } from './components/TwitchStream';
export { useChatStore } from './store';
export { useWebSocket } from './hooks/useWebSocket';
export { useImageCache } from './hooks/useImageCache';
export { 
  useUserDetails, 
  batchFetchUserDetails,
  clearAllUserDetailsCache,
  clearUserDetailsCache,
  getCachedUserDetails,
  preloadUserDetails,
  type UserDetails,
} from './hooks/useUserDetails';
export { UserAvatar } from './components/UserAvatar';
export { Username } from './components/Username';
export * from './types';

// Import styles (includes Tailwind)
import './index.css';

