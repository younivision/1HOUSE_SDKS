export type MessageType = 'text' | 'image' | 'video' | 'gif' | 'system' | 'tip';

export interface MediaItem {
  url: string;
  thumbnail?: string;
  type: 'image' | 'video' | 'gif';
  width?: number;
  height?: number;
  duration?: number;
}

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Message {
  _id?: string;
  id: string;
  messageId: string;
  userId: string;
  username: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  avatar?: string;
  color?: string;
  media?: MediaItem[];
  reactions?: Reaction[];
  isEdited?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  replyTo?: string;
  mentions?: string[];
  reports?: Array<{
    userId: string;
    reason: string;
    reportedAt: Date;
  }>;
  tip?: {
    amount: number;
    recipientId: string;
    recipientName: string;
    senderId: string;
    senderName: string;
    timestamp: string;
  };
}

export interface User {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  color?: string;
  role?: 'user' | 'moderator' | 'admin';
  isOnline?: boolean;
  lastSeen?: Date;
  joinedAt: Date;
}

export interface Room {
  roomId: string;
  name: string;
  description?: string;
  type: 'public' | 'private';
  settings: {
    allowImages: boolean;
    allowVideos: boolean;
    allowGifs: boolean;
    allowReactions: boolean;
    slowMode: number;
  };
}

export enum MessageTypeEnum {
  // Connection
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  
  // Messages
  MESSAGE = 'MESSAGE',
  MESSAGE_EDIT = 'MESSAGE_EDIT',
  MESSAGE_DELETE = 'MESSAGE_DELETE',
  MESSAGE_REPORT = 'MESSAGE_REPORT',
  MESSAGE_REPORTED = 'MESSAGE_REPORTED', // Broadcast when message is reported
  TIP = 'TIP',
  
  // Reactions
  REACTION_ADD = 'REACTION_ADD',
  REACTION_REMOVE = 'REACTION_REMOVE',
  REACTION = 'REACTION', // Broadcast for reaction updates
  
  // Users
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT',
  USER_BAN = 'USER_BAN',
  USER_STATUS = 'USER_STATUS',
  
  // Typing
  TYPING = 'TYPING',
  TYPING_STOP = 'TYPING_STOP',
  
  // Rooms
  ROOM_LIST = 'ROOM_LIST',
  
  // History
  HISTORY = 'HISTORY',
  
  // System
  ERROR = 'ERROR',
  PING = 'PING',
  PONG = 'PONG'
}

export interface WebSocketMessage {
  type: MessageTypeEnum | string;
  payload?: any;
  userId?: string;
  roomId?: string;
  timestamp?: Date;
}

export interface LiveChatProps {
  apiKey: string;
  userId: string;
  username: string;
  roomId?: string;
  avatar?: string;
  role?: 'user' | 'moderator' | 'admin';
  theme?: 'light' | 'dark';
  maxHeight?: string;
  className?: string;
  hideHeader?: boolean;
  customStyles?: {
    container?: React.CSSProperties;
    header?: React.CSSProperties;
    messages?: React.CSSProperties;
    input?: React.CSSProperties;
    message?: React.CSSProperties;
    userList?: React.CSSProperties;
  };
  accentColor?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: Message) => void;
  onError?: (error: string) => void;
  enableReactions?: boolean;
  enableReporting?: boolean;
  // User details API configuration
  userDetailsApi?: {
    endpoint: string;
    apiKey: string;
    cacheDuration?: number; // in milliseconds
    enabled?: boolean;
  };
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
}

export interface ChatStore {
  messages: Message[];
  users: User[];
  currentRoom?: Room;
  isConnected: boolean;
  isTyping: Map<string, boolean>;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  setMessages: (messages: Message[]) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  setUsers: (users: User[]) => void;
  setCurrentRoom: (room: Room) => void;
  setConnected: (connected: boolean) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
  clearTyping: (userId: string) => void;
}

