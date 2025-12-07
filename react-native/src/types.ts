import { ViewStyle, TextStyle } from 'react-native';

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
  id: string;
  messageId?: string;
  userId: string;
  username: string;
  avatar?: string;
  color?: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  media?: MediaItem[];
  reactions?: Reaction[];
  mentions?: string[];
  replyTo?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
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
  TIP = 'TIP',
  
  // Reactions
  REACTION_ADD = 'REACTION_ADD',
  REACTION_REMOVE = 'REACTION_REMOVE',
  REACTION = 'REACTION',
  
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
  ROOM_CREATE = 'ROOM_CREATE',
  ROOM_JOIN = 'ROOM_JOIN',
  ROOM_LEAVE = 'ROOM_LEAVE',
  
  // System
  HISTORY = 'HISTORY',
  ERROR = 'ERROR',
  PING = 'PING',
  PONG = 'PONG',
}

export interface WebSocketMessage {
  type: MessageTypeEnum;
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
  color?: string;
  role?: 'user' | 'moderator' | 'admin';
  theme?: 'light' | 'dark';
  className?: string;
  customStyles?: {
    container?: ViewStyle;
    header?: ViewStyle;
    messages?: ViewStyle;
    input?: ViewStyle;
    message?: ViewStyle;
    userList?: ViewStyle;
  };
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: Message) => void;
  onError?: (error: string) => void;
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
