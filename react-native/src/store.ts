import { create } from 'zustand';
import { ChatStore, Message, User, Room } from './types';

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  users: [],
  currentRoom: undefined,
  isConnected: false,
  isTyping: new Map(),

  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (messageId: string, updates: Partial<Message>) =>
    set((state) => ({
      messages: state.messages.map(msg =>
        msg.messageId === messageId || msg.id === messageId
          ? { ...msg, ...updates }
          : msg
      ),
    })),

  deleteMessage: (messageId: string) =>
    set((state) => ({
      messages: state.messages.map(msg =>
        msg.messageId === messageId || msg.id === messageId
          ? { ...msg, isDeleted: true }
          : msg
      ),
    })),

  setMessages: (messages: Message[]) =>
    set({ messages }),

  addUser: (user: User) =>
    set((state) => ({
      users: [...state.users.filter(u => u.userId !== user.userId), user],
    })),

  removeUser: (userId: string) =>
    set((state) => ({
      users: state.users.filter(u => u.userId !== userId),
    })),

  setUsers: (users: User[]) =>
    set({ users }),

  setCurrentRoom: (room: Room) =>
    set({ currentRoom: room }),

  setConnected: (connected: boolean) =>
    set({ isConnected: connected }),

  setTyping: (userId: string, isTyping: boolean) =>
    set((state) => {
      const newTyping = new Map(state.isTyping);
      newTyping.set(userId, isTyping);
      return { isTyping: newTyping };
    }),

  clearTyping: (userId: string) =>
    set((state) => {
      const newTyping = new Map(state.isTyping);
      newTyping.delete(userId);
      return { isTyping: newTyping };
    }),
}));
