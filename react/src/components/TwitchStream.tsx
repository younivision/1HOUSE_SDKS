import React, { useState, useRef, useEffect } from 'react';
import { LiveChat } from './LiveChat';
import { TipModal } from './TipModal';
import { useChatStore } from '../store';
import { useWebSocket } from '../hooks/useWebSocket';

export interface TwitchStreamProps {
  // LiveChat props
  apiKey: string;
  userId: string; // User ID for embedded scenarios - used for wallet balance and tip API calls
  username: string;
  roomId: string;
  role?: 'user' | 'moderator' | 'admin';
  theme?: 'light' | 'dark';
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: any) => void;
  onError?: (error: any) => void;

  // Twitch-style props
  streamTitle: string;
  streamerName: string;
  hostId?: string; // Host/Streamer user ID - used as recipient for tip API calls
  viewerCount?: number;
  isLive?: boolean;
  
  // Video/iframe props
  videoSrc?: string;
  iframeSrc?: string;
  videoPoster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  videoFit?: 'contain' | 'cover' | 'fill' | 'scale-down' | 'none';
  hideControlsForEmbedded?: boolean;
  
  // Customization props
  streamerAvatar?: string;
  showChatToggle?: boolean;
  chatWidth?: string;
  headerColor?: string;
  className?: string;
  
  // Fullscreen props
  showFullscreenButton?: boolean;
  fullscreenButtonPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  
  // Typography props
  titleFontSize?: string;
  detailsFontSize?: string;
  
  // Wallet functionality
  walletBalance?: number; // Current wallet balance in tokens
  onFundWallet?: () => void; // Callback when user wants to fund wallet
  // API Gateway configuration for tips and wallet
  apiGateway?: {
    baseUrl?: string; // API Gateway base URL (default: https://api-gateway.dev.1houseglobalservices.com)
    apiKey?: string; // API Gateway API key for x-api-key header
    getWalletBalance?: (userId: string) => Promise<number>; // Custom function to fetch wallet balance
    getBearerToken?: (userId: string, roomId: string, username: string) => Promise<string | null>; // Custom function to get bearer token, or uses default endpoint
  };
  streamerNameFontSize?: string;
  
  // Chat props
  chatSize?: 'sm' | 'md' | 'lg' | 'xl';
  chatAnimation?: boolean;
  
  // Display props
  showViewerCount?: boolean;
  showLiveIndicator?: boolean;
  
  // Color props
  accentColor?: string;
  
  // Notification props
  notificationDuration?: number;
  notificationsEnabled?: boolean;
  
  // Resize and container props
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  resizable?: boolean;
  containerStyle?: React.CSSProperties;
}

export const TwitchStream: React.FC<TwitchStreamProps> = ({
  // LiveChat props
  apiKey,
  userId,
  username,
  roomId,
  role = 'user',
  theme = 'dark',
  onConnect,
  onDisconnect,
  onMessage,
  onError,

  // Twitch-style props
  streamTitle,
  streamerName,
  hostId,
  viewerCount = 0,
  isLive = true,
  
  // Video/iframe props
  videoSrc,
  iframeSrc,
  videoPoster,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = true,
  videoFit = 'cover',
  hideControlsForEmbedded = false,
  
  // Customization props
  streamerAvatar,
  showChatToggle = true,
  chatWidth = '24rem', // 384px
  headerColor = '#171719',
  className = '',
  
  // Fullscreen props
  showFullscreenButton = true,
  fullscreenButtonPosition = 'top-right',
  
  // Typography props
  titleFontSize = '1.125rem', // 18px
  detailsFontSize = '0.875rem', // 14px
  streamerNameFontSize = '0.875rem', // 14px
  
  // Chat props
  chatSize = 'md',
  chatAnimation = true,
  
  // Display props
  showViewerCount = true,
  showLiveIndicator = true,
  
  // Color props
  accentColor = '#269F47',
  
  // Notification props
  notificationDuration = 4000,
  notificationsEnabled: initialNotificationsEnabled = true,
  
  // Resize and container props
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  resizable = false,
  containerStyle = {},
  
  // Wallet functionality
  walletBalance: initialWalletBalance = 0,
  onFundWallet,
  // API Gateway configuration
  apiGateway,
}) => {
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatAnimationState, setChatAnimationState] = useState<'idle' | 'entering' | 'exiting'>('idle');
  const [isProfileImageLoading, setIsProfileImageLoading] = useState(true);
  const [profileImageError, setProfileImageError] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    timestamp: number;
    isVisible: boolean;
  }>>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(initialNotificationsEnabled);
  const [showTipModal, setShowTipModal] = useState(false);
  const [currentWalletBalance, setCurrentWalletBalance] = useState(initialWalletBalance);
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [fetchedUsername, setFetchedUsername] = useState<string | null>(null); // Username fetched from API
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  
  // Get chat state for connection indicator and user count
  const { users, isConnected } = useChatStore();
  
  // Use fetched username if available, otherwise use prop username
  // Prioritize fetched username from API over prop username
  const effectiveUsername = fetchedUsername || username;
  
  // Log when username changes for debugging
  useEffect(() => {
    if (fetchedUsername) {
      console.log('👤 [TwitchStream] Username updated:', {
        oldUsername: username,
        fetchedUsername: fetchedUsername,
        effectiveUsername: effectiveUsername,
      });
    }
  }, [fetchedUsername, username, effectiveUsername]);
  
  // Get WebSocket functions for tip functionality
  // Note: useWebSocket will automatically reconnect when effectiveUsername changes
  // because it's passed as the username prop and the hook's useEffect depends on props.username
  const { sendTip: sendTipWebSocket } = useWebSocket({
    apiKey,
    userId,
    username: effectiveUsername, // Use fetched username if available, prioritizing API data
    roomId,
    role,
    onConnect,
    onDisconnect,
    onMessage,
    onError,
  });
  
  // Get recipient info for tips (streamer)
  const recipientId = hostId;
  const recipientName = streamerName || 'Streamer';
  
  // Fetch bearer token for API authentication
  const fetchBearerToken = async () => {
    if (!apiGateway) return null;
    
    try {
      if (apiGateway.getBearerToken) {
        // Use custom function if provided
        const token = await apiGateway.getBearerToken(userId, roomId, username);
        console.log('🔑 [TwitchStream] Bearer token fetched (custom function):', token ? 'Token received' : 'No token');
        setBearerToken(token);
        return token;
      } else {
        // Default API call to get bearer token
        const baseUrl = apiGateway.baseUrl || 'https://api-gateway.dev.1houseglobalservices.com';
        const requestBody = {
          userId,
          roomId,
          username,
        };
        console.log('🔑 [TwitchStream] Fetching bearer token:', { baseUrl, endpoint: '/v1/auth/token', requestBody });
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };
        
        // Add x-api-key header if provided
        if (apiGateway.apiKey) {
          headers['x-api-key'] = apiGateway.apiKey;
        }
        
        const response = await fetch(`${baseUrl}/v1/auth/token`, {
          method: 'POST',
          headers,
          credentials: 'omit',
          body: JSON.stringify(requestBody),
        });
        
        console.log('🔑 [TwitchStream] Bearer token response status:', response.status, response.statusText);
        
        if (response.ok) {
          const responseData = await response.json();
          console.log('🔑 [TwitchStream] Bearer token response data:', responseData);
          // Extract token from response - could be data.token or data.data.token
          const token = responseData.data?.token || responseData.data?.accessToken || responseData.data?.bearerToken || 
                        responseData.token || responseData.accessToken || responseData.bearerToken;
          if (token) {
            console.log('🔑 [TwitchStream] Bearer token set successfully');
            setBearerToken(token);
            return token;
          } else {
            console.warn('🔑 [TwitchStream] No token found in response data:', responseData);
          }
        } else {
          const errorText = await response.text();
          console.error('🔑 [TwitchStream] Failed to fetch bearer token:', response.status, errorText);
        }
      }
    } catch (error) {
      console.error('🔑 [TwitchStream] Error fetching bearer token:', error);
    }
    return null;
  };
  
  // Fetch user info from API Gateway
  const fetchUserInfo = async () => {
    if (!apiGateway || !userId) return;
    
    try {
      // Ensure we have a bearer token first
      let token = bearerToken;
      if (!token) {
        token = await fetchBearerToken();
        if (!token) {
          console.warn('🔑 [TwitchStream] No bearer token available, cannot fetch user info');
          return;
        }
      }
      
      const baseUrl = apiGateway.baseUrl || 'https://api-gateway.dev.1houseglobalservices.com';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      // Add x-api-key header if provided
      if (apiGateway.apiKey) {
        headers['x-api-key'] = apiGateway.apiKey;
      }
      
      // Add bearer token
      headers['Authorization'] = `Bearer ${token}`;
      
      console.log('👤 [TwitchStream] Fetching user info for userId:', userId);
      
      const response = await fetch(`${baseUrl}/v1/user/${userId}`, {
        method: 'GET',
        headers,
        credentials: 'omit',
      });
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('👤 [TwitchStream] User info response:', responseData);
        
        // Extract user data - could be data.data or data
        const userData = responseData.data?.data || responseData.data || responseData;
        
        // Prioritize firstName + lastName, then username, then email prefix
        const fetchedName = userData.firstName 
          ? `${userData.firstName}${userData.lastName ? ' ' + userData.lastName : ''}`.trim()
          : userData.username || userData.email?.split('@')[0] || null;
        
        if (fetchedName) {
          console.log('👤 [TwitchStream] Fetched username:', fetchedName);
          setFetchedUsername(fetchedName);
        } else {
          console.warn('👤 [TwitchStream] No username found in user data');
        }
      } else if (response.status === 401 && !bearerToken) {
        // If unauthorized and no token, try to get token and retry
        const newToken = await fetchBearerToken();
        if (newToken) {
          // Retry with new token
          return fetchUserInfo();
        }
      } else {
        const errorText = await response.text();
        console.warn('👤 [TwitchStream] Failed to fetch user info:', response.status, errorText);
      }
    } catch (error) {
      console.error('👤 [TwitchStream] Error fetching user info:', error);
    }
  };
  
  // Fetch wallet balance from API
  const fetchWalletBalance = async () => {
    if (!apiGateway) return;
    
    try {
      if (apiGateway.getWalletBalance) {
        // Use custom function if provided
        const balance = await apiGateway.getWalletBalance(userId);
        setCurrentWalletBalance(balance);
      } else {
        // Default API call to fetch wallet balance
        const baseUrl = apiGateway.baseUrl || 'https://api-gateway.dev.1houseglobalservices.com';
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };
        
        // Add x-api-key header if provided
        if (apiGateway.apiKey) {
          headers['x-api-key'] = apiGateway.apiKey;
        }
        
        // Add bearer token if available
        if (bearerToken) {
          headers['Authorization'] = `Bearer ${bearerToken}`;
        }
        
        const response = await fetch(`${baseUrl}/v1/wallets/balance/${userId}`, {
          method: 'GET',
          headers,
          credentials: 'omit',
        });
        
        if (response.ok) {
          const responseData = await response.json();
          console.log('💚 [TwitchStream] Wallet balance response:', responseData);
          // Extract balance from response - could be data.balance or data.data.balance
          const balance = responseData.data?.balance ?? responseData.balance ?? 0;
          console.log('💚 [TwitchStream] Extracted balance:', balance);
          setCurrentWalletBalance(balance);
        } else if (response.status === 401 && !bearerToken) {
          // If unauthorized and no token, try to get token and retry
          const token = await fetchBearerToken();
          if (token) {
            // Retry with token
            return fetchWalletBalance();
          }
        }
      }
    } catch (error) {
      // Silently handle wallet balance fetch errors
    }
  };
  
  // Send tip to API Gateway
  const sendTipToAPI = async (amount: number, recipientId: string, recipientName: string) => {
    if (!apiGateway) return false;
    
    try {
      // Ensure bearer token is available before making the request
      let token = bearerToken;
      if (!token) {
        console.log('💚 [TwitchStream] No bearer token available, fetching token first...');
        token = await fetchBearerToken();
        if (!token) {
          console.error('💚 [TwitchStream] Failed to fetch bearer token, cannot send tip');
          return false;
        }
      }
      
      const baseUrl = apiGateway.baseUrl || 'https://api-gateway.dev.1houseglobalservices.com';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      // Add x-api-key header if provided
      if (apiGateway.apiKey) {
        headers['x-api-key'] = apiGateway.apiKey;
      }
      
      // Add bearer token (should always be available at this point)
      headers['Authorization'] = `Bearer ${token}`;
      
      const requestBody = {
        recipientId,
        recipientName,
        amount,
        roomId,
      };
      
      console.log('💚 [TwitchStream] Sending tip via API:', { baseUrl, endpoint: '/v1/wallets/tip', requestBody, hasToken: !!token });
      
      const response = await fetch(`${baseUrl}/v1/wallets/tip`, {
        method: 'POST',
        headers,
        credentials: 'omit',
        body: JSON.stringify(requestBody),
      });
      
      console.log('💚 [TwitchStream] Tip response status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('💚 [TwitchStream] Tip sent successfully via API:', data);
        // Refresh wallet balance after sending tip
        await fetchWalletBalance();
        return true;
      } else if (response.status === 401) {
        // If unauthorized, token might be expired - try to refresh and retry once
        console.warn('💚 [TwitchStream] Unauthorized, token may be expired. Fetching new token and retrying...');
        const newToken = await fetchBearerToken();
        if (newToken && newToken !== token) {
          // Retry with new token
          console.log('💚 [TwitchStream] Retrying tip with new token...');
          return sendTipToAPI(amount, recipientId, recipientName);
        }
        const errorText = await response.text();
        console.error('💚 [TwitchStream] Failed to send tip via API after token refresh:', errorText);
        return false;
      } else {
        const errorText = await response.text();
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText, status: response.status };
        }
        console.error('💚 [TwitchStream] Failed to send tip via API:', error);
        return false;
      }
    } catch (error) {
      console.error('💚 [TwitchStream] Error sending tip to API:', error);
      return false;
    }
  };
  
  const handleSendTip = async (amount: number, recipientId: string, recipientName: string) => {
    console.log('💚 [TwitchStream] handleSendTip called:', { amount, recipientId, recipientName });
    
    // Validate hostId is available
    if (!hostId) {
      console.error('💚 [TwitchStream] Cannot send tip: hostId is not provided');
      return;
    }
    
    // Send tip via API Gateway if configured
    if (apiGateway) {
      const apiSuccess = await sendTipToAPI(amount, recipientId, recipientName);
      console.log('💚 [TwitchStream] API tip result:', apiSuccess ? 'Success' : 'Failed');
      
      // Only send WebSocket message if API call succeeded
      if (apiSuccess) {
        console.log('💚 [TwitchStream] Sending tip via WebSocket');
        sendTipWebSocket(amount, recipientId, recipientName);
        setShowTipModal(false);
      } else {
        console.error('💚 [TwitchStream] API tip failed, not sending WebSocket message');
        // Don't close modal on failure so user can retry
      }
    } else {
      // If no API Gateway configured, send via WebSocket only
      console.log('💚 [TwitchStream] No API Gateway, sending tip via WebSocket only');
      sendTipWebSocket(amount, recipientId, recipientName);
      setShowTipModal(false);
    }
  };
  
  // Fetch bearer token on mount and when userId/roomId changes
  useEffect(() => {
    if (apiGateway && userId && roomId && username) {
      fetchBearerToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, roomId, username, apiGateway?.baseUrl]);
  
  // Fetch user info after bearer token is available
  useEffect(() => {
    if (apiGateway && userId && bearerToken) {
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, bearerToken, apiGateway?.baseUrl]);
  
  // Fetch wallet balance on mount and when userId, apiGateway, or bearerToken changes
  useEffect(() => {
    if (apiGateway && userId) {
      fetchWalletBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, apiGateway?.baseUrl, bearerToken]);
  
  // Update wallet balance when prop changes
  useEffect(() => {
    setCurrentWalletBalance(initialWalletBalance);
  }, [initialWalletBalance]);
  
  // Use chatroom participants as default viewer count if not provided
  // Make it reactive to changes in users array
  const currentViewerCount = viewerCount !== undefined ? viewerCount : users.length;
  
  // Force re-render when users array changes
  useEffect(() => {
    // This will trigger a re-render when users array changes
  }, [users.length]);

  // Profile image loading handlers
  const handleProfileImageLoad = () => {
    setIsProfileImageLoading(false);
    setProfileImageError(false);
  };

  const handleProfileImageError = () => {
    setIsProfileImageLoading(false);
    setProfileImageError(true);
  };

  // Notification management
  const addNotification = (message: string) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      message,
      timestamp: Date.now(),
      isVisible: true,
    };
    
    setNotifications(prev => {
      const updated = [...prev, newNotification];
      return updated;
    });
    
    // Auto-hide after specified duration
    const hideTimeout = setTimeout(() => {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isVisible: false } : notif
        )
      );
      
      // Remove from array after animation
      const removeTimeout = setTimeout(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      }, 500); // Increased animation time
      
      // Store timeout for cleanup
      return () => {
        clearTimeout(hideTimeout);
        clearTimeout(removeTimeout);
      };
    }, notificationDuration);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isVisible: false } : notif
      )
    );
    
    // Remove from array after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 500);
  };


  // Auto-play video
  useEffect(() => {
    if (videoRef.current && autoPlay) {
      videoRef.current.play().catch(() => {
        // Silently handle play errors
      });
    }
  }, [autoPlay]);

  // WebSocket event listeners for notifications
  useEffect(() => {
    let previousUsers: any[] = [];
    let previousMessages: any[] = [];

    const checkForNewUsers = () => {
      const currentUsers = useChatStore.getState().users;
      const newUsers = currentUsers.filter(user => 
        !previousUsers.some(prevUser => prevUser.userId === user.userId)
      );
      
      newUsers.forEach(user => {
        // Check if user is current user - compare by userId if available, otherwise by username
        const isOwnUser = user.userId 
          ? user.userId === userId 
          : user.username === username || user.username === effectiveUsername;
        
        if (user.username && !isOwnUser && notificationsEnabled) {
          addNotification(`${user.username} joined the stream!`);
        }
      });
      
      previousUsers = currentUsers;
    };

    const checkForNewMessages = () => {
      const currentMessages = useChatStore.getState().messages;
      const newMessages = currentMessages.filter(message => 
        !previousMessages.some(prevMessage => prevMessage.id === message.id)
      );
      
      newMessages.forEach(message => {
        // Skip history messages (messages older than 5 seconds are likely history)
        const messageAge = Date.now() - new Date(message.timestamp).getTime();
        const isRecentMessage = messageAge < 5000; // 5 seconds
        
        // Check if message is from current user - compare by userId if available, otherwise by username
        const isOwnMessage = message.userId 
          ? message.userId === userId 
          : message.username === username || message.username === effectiveUsername;
        
        if (message.username && message.content && !isOwnMessage && isRecentMessage && notificationsEnabled) {
          // Truncate long messages
          const truncatedContent = message.content.length > 50 
            ? message.content.substring(0, 50) + '...' 
            : message.content;
          addNotification(`${message.username}: ${truncatedContent}`);
        }
      });
      
      previousMessages = currentMessages;
    };

    // Set up polling to check for changes
    const interval = setInterval(() => {
      checkForNewUsers();
      checkForNewMessages();
    }, 1000);

    return () => clearInterval(interval);
  }, [isChatVisible, username, effectiveUsername, userId]);

  // Track container size changes
  useEffect(() => {
    if (!fullscreenRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(fullscreenRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate responsive chat width
  const getResponsiveChatWidth = () => {
    if (containerSize.width === 0) return chatWidth;
    
    // If container is small, use percentage-based width
    if (containerSize.width < 768) {
      return '100%';
    } else if (containerSize.width < 1024) {
      return '20rem';
    } else {
      return chatWidth;
    }
  };

  // Fullscreen functionality
  const toggleFullscreen = async () => {
    if (!fullscreenRef.current) return;

    try {
      if (!isFullscreen) {
        if (fullscreenRef.current.requestFullscreen) {
          await fullscreenRef.current.requestFullscreen();
        } else if ((fullscreenRef.current as any).webkitRequestFullscreen) {
          await (fullscreenRef.current as any).webkitRequestFullscreen();
        } else if ((fullscreenRef.current as any).msRequestFullscreen) {
          await (fullscreenRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      // Silently handle fullscreen errors
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Chat toggle with animation
  const toggleChat = () => {
    if (chatAnimation) {
      if (isChatVisible) {
        setChatAnimationState('exiting');
        setTimeout(() => {
          setIsChatVisible(false);
          setChatAnimationState('idle');
        }, 300);
      } else {
        setChatAnimationState('entering');
        setIsChatVisible(true);
        setTimeout(() => {
          setChatAnimationState('idle');
        }, 300);
      }
    } else {
      setIsChatVisible(!isChatVisible);
    }
  };

  const renderVideoContent = () => {
    if (iframeSrc) {
      return (
        <iframe
          src={iframeSrc}
          className="w-full h-full border-0"
          allowFullScreen
          title="Stream Content"
          style={{ objectFit: videoFit }}
        />
      );
    }
    
    if (videoSrc) {
      return (
        <video
          ref={videoRef}
          className="w-full h-full bg-gray-800 max-h-full"
          src={videoSrc}
          controls={hideControlsForEmbedded ? false : controls}
          muted={muted}
          loop={loop}
          poster={videoPoster}
          autoPlay={autoPlay}
          style={{ objectFit: videoFit }}
        />
      );
    }

    // Default placeholder
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">📺</div>
          <p className="text-lg">No video source provided</p>
        </div>
      </div>
    );
  };

  // Build container styles
  const containerStyles: React.CSSProperties = {
    width: width || '100%',
    height: height || '100vh',
    minWidth: minWidth || '320px',
    minHeight: minHeight || '200px',
    maxWidth: maxWidth || 'none',
    maxHeight: maxHeight || 'none',
    resize: resizable ? 'both' : 'none',
    overflow: 'hidden',
    ...containerStyle,
  };

  return (
    <div 
      ref={fullscreenRef}
      className={`twitch-stream-container bg-gray-900 text-gray-100 font-sans flex flex-col ${className}`}
      style={containerStyles}
    >
      {/* Stream Header */}
      <header 
        className="flex justify-between items-center px-6 py-4 border-b border-gray-700 flex-shrink-0 z-30"
        style={{ backgroundColor: headerColor }}
      >
        <div className="flex items-center gap-3">
              {streamerAvatar && (
                <div 
                  className="w-10 h-10 rounded-full overflow-hidden border-2 relative"
                  style={{ borderColor: accentColor }}
                >
                  {isProfileImageLoading && !profileImageError && (
                    <div className="absolute inset-0 bg-gray-700 animate-pulse">
                      <div className="w-full h-full bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 bg-[length:200%_100%] animate-shimmer"></div>
                    </div>
                  )}
                  {profileImageError ? (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={streamerAvatar} 
                      alt={streamerName} 
                      className="w-full h-full object-cover" 
                      onLoad={handleProfileImageLoad}
                      onError={handleProfileImageError}
                      style={{ opacity: isProfileImageLoading ? 0 : 1 }}
                    />
                  )}
                </div>
              )}
          <div className="flex flex-col gap-1">
            <h1 
              className="font-semibold text-gray-100 m-0 leading-tight"
              style={{ fontSize: titleFontSize }}
            >
              {streamTitle}
            </h1>
            <div 
              className="flex items-center gap-4 text-gray-400"
              style={{ fontSize: detailsFontSize }}
            >
              <span 
                className="font-medium"
                style={{ fontSize: streamerNameFontSize, color: accentColor }}
              >
                {streamerName}
              </span>
              {showViewerCount && (
                <span className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                    <path d="M8 2.5C4.5 2.5 1.73 4.61 1 7.5C1.73 10.39 4.5 12.5 8 12.5C11.5 12.5 14.27 10.39 15 7.5C14.27 4.61 11.5 2.5 8 2.5ZM8 10.5C6.07 10.5 4.5 9.16 4.5 7.5C4.5 5.84 6.07 4.5 8 4.5C9.93 4.5 11.5 5.84 11.5 7.5C11.5 9.16 9.93 10.5 8 10.5ZM8 6C7.17 6 6.5 6.67 6.5 7.5C6.5 8.33 7.17 9 8 9C8.83 9 9.5 8.33 9.5 7.5C9.5 6.67 8.83 6 8 6Z" fill="#9CA3AF"/>
                  </svg>
                  {currentViewerCount}
                </span>
              )}
              {isLive && showLiveIndicator && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                    <path d="M8 9.58666C8.87629 9.58666 9.58666 8.87629 9.58666 8C9.58666 7.1237 8.87629 6.41333 8 6.41333C7.12371 6.41333 6.41333 7.1237 6.41333 8C6.41333 8.87629 7.12371 9.58666 8 9.58666Z" fill="#EC2A2A"/>
                    <path d="M13.3334 12.5001C13.2268 12.5001 13.1268 12.4667 13.0334 12.4001C12.8134 12.2334 12.7668 11.9201 12.9334 11.7001C13.7401 10.6267 14.1668 9.34673 14.1668 8.00006C14.1668 6.65339 13.7401 5.37339 12.9334 4.30006C12.7668 4.08006 12.8134 3.76673 13.0334 3.60006C13.2534 3.43339 13.5668 3.48006 13.7334 3.70006C14.6734 4.94673 15.1668 6.43339 15.1668 8.00006C15.1668 9.56673 14.6734 11.0534 13.7334 12.3001C13.6334 12.4334 13.4868 12.5001 13.3334 12.5001Z" fill="#EC2A2A"/>
                    <path d="M2.66659 12.5001C2.51325 12.5001 2.36659 12.4334 2.26659 12.3001C1.32659 11.0534 0.833252 9.56673 0.833252 8.00006C0.833252 6.43339 1.32659 4.94673 2.26659 3.70006C2.43325 3.48006 2.74659 3.43339 2.96659 3.60006C3.18659 3.76673 3.23325 4.08006 3.06659 4.30006C2.25992 5.37339 1.83325 6.65339 1.83325 8.00006C1.83325 9.34673 2.25992 10.6267 3.06659 11.7001C3.23325 11.9201 3.18659 12.2334 2.96659 12.4001C2.87992 12.4667 2.77325 12.5001 2.66659 12.5001Z" fill="#EC2A2A"/>
                    <path d="M11.1999 10.9C11.0932 10.9 10.9932 10.8667 10.8999 10.8C10.6799 10.6334 10.6332 10.32 10.7999 10.1C11.2599 9.49337 11.4999 8.7667 11.4999 8.00004C11.4999 7.23337 11.2599 6.5067 10.7999 5.90004C10.6332 5.68004 10.6799 5.3667 10.8999 5.20004C11.1199 5.03337 11.4332 5.08004 11.5999 5.30004C12.1866 6.0867 12.4999 7.02004 12.4999 8.00004C12.4999 8.98004 12.1866 9.92004 11.5999 10.7C11.4999 10.8334 11.3532 10.9 11.1999 10.9Z" fill="#EC2A2A"/>
                    <path d="M4.8 10.9C4.64667 10.9 4.5 10.8334 4.4 10.7C3.81333 9.92004 3.5 8.98004 3.5 8.00004C3.5 7.02004 3.81333 6.08004 4.4 5.30004C4.56667 5.08004 4.88 5.03337 5.1 5.20004C5.32 5.3667 5.36667 5.68004 5.2 5.90004C4.74 6.5067 4.5 7.23337 4.5 8.00004C4.5 8.7667 4.74 9.49337 5.2 10.1C5.36667 10.32 5.32 10.6334 5.1 10.8C5.01333 10.8667 4.90667 10.9 4.8 10.9Z" fill="#EC2A2A"/>
                  </svg>
                  {/* <span>LIVE</span> */}
                </div>
              )}
            </div>
          </div>
        </div>
        {showChatToggle && (
          <div className="flex items-center gap-3">
            <button 
              className="px-4 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 bg-[#269f47] hover:bg-[#13712d] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!hostId}
              onClick={() => {
                if (!hostId) return;
                // Refresh wallet balance when opening tip modal
                if (apiGateway && userId) {
                  fetchWalletBalance();
                }
                setShowTipModal(true);
              }}
            >
              <span>💚</span>
              <span>Tip</span>
            </button>
            <button 
              className="px-4 py-2 rounded cursor-pointer font-medium transition-all duration-200 bg-gray-600 text-gray-100 text-base hover:bg-gray-500 flex items-center gap-2"
              onClick={toggleChat}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
              Chat
            </button>
          </div>
        )}
      </header>

      {/* Main Stream Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Player */}
        <div 
          className="twitch-video-container relative bg-black overflow-hidden transition-all duration-300"
          style={{ 
            width: isChatVisible ? `calc(100% - ${getResponsiveChatWidth()})` : '100%'
          }}
        >
          {renderVideoContent()}
          
          {/* Stream Overlay Elements */}
          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-10">
            <div className="absolute top-16 right-5 flex flex-col gap-2.5 max-w-xs">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`bg-black/80 text-white px-3 py-2 border-l-4 flex items-center gap-2 text-xs font-medium group ${
                    notification.isVisible 
                      ? 'notification-enter-twitch' 
                      : 'notification-exit-twitch'
                  }`}
                  style={{ 
                    borderLeftColor: accentColor,
                    transform: `translateY(${index * -4}px)`,
                    zIndex: notifications.length - index,
                    '--stagger-delay': `${index * 100}ms`
                  } as React.CSSProperties}
                >
                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <span className="truncate">{notification.message}</span>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="ml-2 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 p-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            {/* Fullscreen Button */}
            {showFullscreenButton && (
              <div 
                className={`absolute pointer-events-auto z-20 ${
                  fullscreenButtonPosition === 'top-right' ? 'top-5 right-5' :
                  fullscreenButtonPosition === 'top-left' ? 'top-5 left-5' :
                  fullscreenButtonPosition === 'bottom-right' ? 'bottom-5 right-5' :
                  'bottom-5 left-5'
                }`}
              >
                <button
                  onClick={toggleFullscreen}
                  className="bg-black/80 hover:bg-black/90 text-white p-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        {isChatVisible && (
          <div 
            className={`twitch-chat-overlay twitch-chat-${chatSize} bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 flex flex-col overflow-hidden transition-all duration-300 ${
              chatAnimation ? chatAnimationState : ''
            }`}
            style={{ width: getResponsiveChatWidth() }}
          >
            <div 
              className="flex justify-between items-center px-5 py-4 border-b border-gray-700 flex-shrink-0"
              style={{ backgroundColor: headerColor }}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className="text-base font-semibold text-gray-100">Stream Chat</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  className="px-3 py-1.5 rounded font-medium text-sm transition-all bg-gray-600 hover:bg-gray-500 text-gray-100 flex items-center gap-2"
                  onClick={() => {/* Toggle user list if needed */}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7s1.79 4 4 4 4-1.79 4-4zm-4 2c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-3 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  {users.length}
                </button>
                <button 
                  className={`px-3 py-1.5 rounded font-medium text-sm transition-all flex items-center gap-2 ${
                    notificationsEnabled 
                      ? 'bg-green-600 hover:bg-green-500 text-white' 
                      : 'bg-gray-600 hover:bg-gray-500 text-gray-100'
                  }`}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
                >
                  {notificationsEnabled ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-6-1c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1z"/>
                      <path d="M3.5 5.5L2.09 4.09l1.41-1.41L4.91 4.09 3.5 5.5zM20.5 5.5L19.09 4.09l1.41-1.41L21.91 4.09 20.5 5.5z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden bg-gray-900 min-h-0 h-full flex flex-col">
              <LiveChat
                apiKey={apiKey}
                userId={userId}
                username={username}
                roomId={roomId}
                role={role}
                theme={theme}
                maxHeight="100%"
                hideHeader={true}
                accentColor={accentColor}
                onConnect={onConnect}
                onDisconnect={onDisconnect}
                onMessage={onMessage}
                onError={onError}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Tip Modal */}
      <TipModal
        visible={showTipModal}
        onClose={() => setShowTipModal(false)}
        onSendTip={handleSendTip}
        recipientId={recipientId}
        recipientName={recipientName}
        theme={theme}
        variant="twitch"
        walletBalance={currentWalletBalance}
        onFundWallet={onFundWallet}
      />
    </div>
  );
};
