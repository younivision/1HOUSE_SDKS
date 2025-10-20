import { useEffect, useRef, useCallback } from 'react';
import { MessageTypeEnum, WebSocketMessage, LiveChatProps } from '../types';
import { useChatStore } from '../store';

// Hardcoded server URL
const SERVER_URL = 'https://prod.chat-service.1houseglobalservices.com';

export function useWebSocket(props: LiveChatProps) {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const pingInterval = useRef<NodeJS.Timeout>();
  
  const { 
    setMessages, 
    setUsers, 
    addMessage, 
    addUser, 
    removeUser, 
    setConnected,
    setTyping,
    clearTyping
  } = useChatStore();

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      // Add API key as query parameter
      const url = `${SERVER_URL}${SERVER_URL.includes('?') ? '&' : '?'}apiKey=${props.apiKey}`;
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        props.onConnect?.();

        // Send connect message
        send({
          type: MessageTypeEnum.CONNECT,
          payload: {
            userId: props.userId,
            username: props.username,
            roomId: props.roomId || 'default',
            avatar: props.avatar,
          },
        });

        // Start ping interval
        pingInterval.current = setInterval(() => {
          send({ type: MessageTypeEnum.PING });
        }, 30000);
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        props.onError?.('Connection error');
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        props.onDisconnect?.();
        
        if (pingInterval.current) {
          clearInterval(pingInterval.current);
        }

        // Attempt reconnection
        reconnectTimeout.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      props.onError?.('Failed to connect');
    }
  }, [props, setConnected]);

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case MessageTypeEnum.HISTORY:
        const { messages, users } = message.payload;
        setMessages(messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
        setUsers(users);
        break;

      case MessageTypeEnum.MESSAGE:
        const newMessage = {
          ...message.payload.message,
          timestamp: new Date(message.payload.message.timestamp)
        };
        addMessage(newMessage);
        props.onMessage?.(newMessage);
        break;

      case MessageTypeEnum.USER_JOINED:
        addUser(message.payload.user);
        break;

      case MessageTypeEnum.USER_LEFT:
        removeUser(message.payload.user.userId);
        break;

      case MessageTypeEnum.TYPING:
        const { userId, isTyping } = message.payload;
        if (isTyping) {
          setTyping(userId, true);
          setTimeout(() => clearTyping(userId), 3000);
        } else {
          clearTyping(userId);
        }
        break;

      case MessageTypeEnum.ERROR:
        console.error('Server error:', message.payload.error);
        props.onError?.(message.payload.error);
        break;

      case MessageTypeEnum.PONG:
        // Connection is alive
        break;
    }
  };

  const send = useCallback((message: WebSocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const sendMessage = useCallback((content: string, images?: string[]) => {
    send({
      type: MessageTypeEnum.MESSAGE,
      payload: { content, images },
    });
  }, [send]);

  const sendTyping = useCallback((isTyping: boolean) => {
    send({
      type: MessageTypeEnum.TYPING,
      payload: { isTyping },
    });
  }, [send]);

  const sendReaction = useCallback((messageId: string, emoji: string) => {
    send({
      type: MessageTypeEnum.REACTION_ADD,
      payload: { messageId, emoji },
    });
  }, [send]);

  const reportMessage = useCallback((messageId: string, reason: string) => {
    send({
      type: MessageTypeEnum.MESSAGE_REPORT,
      payload: { messageId, reason },
    });
  }, [send]);

  const banUser = useCallback((userIdToBan: string, roomId: string) => {
    send({
      type: MessageTypeEnum.USER_BAN,
      payload: { userIdToBan, roomId },
    });
  }, [send]);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    if (pingInterval.current) {
      clearInterval(pingInterval.current);
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  return {
    sendMessage,
    sendTyping,
    sendReaction,
    reportMessage,
    banUser,
    disconnect,
    reconnect: connect,
  };
}

