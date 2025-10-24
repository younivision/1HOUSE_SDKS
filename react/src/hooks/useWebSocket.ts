import { useEffect, useRef, useCallback } from 'react';
import { MessageTypeEnum, WebSocketMessage, LiveChatProps } from '../types';
import { useChatStore } from '../store';

export function useWebSocket(props: LiveChatProps) {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const pingInterval = useRef<NodeJS.Timeout>();
  const typingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
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

    // Clean up existing connection
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    try {
      // Add API key as query parameter
      const url = new URL(props.serverUrl);
      url.searchParams.set('apiKey', props.apiKey);
      console.log('🔗 [LiveChat] Connecting to:', url.toString());
      ws.current = new WebSocket(url.toString());

      ws.current.onopen = () => {
        console.log('🔗 [LiveChat] WebSocket onopen fired!');
        console.log('🔗 [LiveChat] ReadyState:', ws.current?.readyState, 'OPEN=', WebSocket.OPEN);
        setConnected(true);
        props.onConnect?.();

        // Send connect message immediately
        try {
          if (ws.current?.readyState === WebSocket.OPEN) {
            const connectMsg = {
              type: MessageTypeEnum.CONNECT,
              payload: {
                userId: props.userId,
                username: props.username,
                roomId: props.roomId || 'default',
                avatar: props.avatar,
              },
            };
            console.log('🚀 [LiveChat] Sending CONNECT:', connectMsg);
            console.log('🚀 [LiveChat] WebSocket before send:', ws.current);
            ws.current.send(JSON.stringify(connectMsg));
            console.log('✅ [LiveChat] CONNECT sent successfully!');
          } else {
            console.error('❌ [LiveChat] WebSocket not OPEN when trying to send CONNECT. State:', ws.current?.readyState);
          }
        } catch (error) {
          console.error('❌ [LiveChat] Error sending CONNECT:', error);
        }

        // Start ping interval
        pingInterval.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            console.log('📡 [LiveChat] Sending PING');
            ws.current.send(JSON.stringify({ type: MessageTypeEnum.PING }));
          }
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
        console.error('❌ [LiveChat] WebSocket error:', error);
        setConnected(false);
        props.onError?.('Connection error');
      };

      ws.current.onclose = (event) => {
        console.log('🔌 [LiveChat] WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
        setConnected(false);
        props.onDisconnect?.();
        
        if (pingInterval.current) {
          clearInterval(pingInterval.current);
        }

        // Only attempt reconnection if it wasn't a manual disconnect
        if (event.code !== 1000) {
          reconnectTimeout.current = setTimeout(() => {
            console.log('🔄 [LiveChat] Attempting to reconnect...');
            connect();
          }, 3000);
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      props.onError?.('Failed to connect');
    }
  }, [props.serverUrl, props.apiKey, props.userId, props.username, props.roomId, props.avatar, props.onConnect, props.onDisconnect, props.onError, setConnected]);

  const handleMessage = (message: WebSocketMessage) => {
    console.log('📨 [LiveChat] handleMessage:', message.type, message.payload);
    switch (message.type) {
      case MessageTypeEnum.HISTORY:
        const { messages, users } = message.payload;
        console.log('📚 [LiveChat] Processing HISTORY:', messages?.length, 'messages,', users?.length, 'users');
        
        if (messages && messages.length > 0) {
          console.log('📚 [LiveChat] First message:', messages[0]);
          const processedMessages = messages.map((m: any) => ({
            ...m,
            id: m.id || m.messageId || m._id,
            messageId: m.messageId || m._id,
            timestamp: new Date(m.timestamp || m.createdAt || Date.now())
          }));
          console.log('📚 [LiveChat] Setting', processedMessages.length, 'messages in store');
          setMessages(processedMessages);
          console.log('✅ [LiveChat] Messages set successfully');
        } else {
          console.warn('⚠️  [LiveChat] HISTORY has no messages');
          setMessages([]);
        }
        
        if (users && users.length > 0) {
          setUsers(users);
          console.log('✅ [LiveChat] Users set:', users.length);
        }
        
        console.log('✅ [LiveChat] HISTORY processed completely');
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
        
        // Clear any existing timeout for this user
        const existingTimeout = typingTimeouts.current.get(userId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          typingTimeouts.current.delete(userId);
        }
        
        if (isTyping) {
          // Show typing indicator immediately
          setTyping(userId, true);
          
          // Set new timeout to clear it after 3 seconds
          const newTimeout = setTimeout(() => {
            clearTyping(userId);
            typingTimeouts.current.delete(userId);
          }, 3000);
          
          typingTimeouts.current.set(userId, newTimeout);
        } else {
          // Clear typing indicator after a short delay
          const newTimeout = setTimeout(() => {
            clearTyping(userId);
            typingTimeouts.current.delete(userId);
          }, 500);
          
          typingTimeouts.current.set(userId, newTimeout);
        }
        break;

      case MessageTypeEnum.MESSAGE_REPORTED:
        // Message was reported - update the reports array
        const reportedMsgId = message.payload.messageId;
        const reports = message.payload.reports;
        console.log('⚠️  [LiveChat] Message reported update:', reportedMsgId, reports.length, 'reports');
        useChatStore.getState().updateMessage(reportedMsgId, { reports });
        break;

      case MessageTypeEnum.MESSAGE_DELETE:
        // Message was deleted - mark as deleted
        const deletedMsgId = message.payload.messageId;
        const deletedBy = message.payload.deletedBy;
        console.log('🗑️  [LiveChat] Message deleted:', deletedMsgId, 'by', deletedBy);
        useChatStore.getState().updateMessage(deletedMsgId, { 
          isDeleted: true, 
          deletedAt: new Date(message.payload.deletedAt),
          deletedBy,
        });
        break;

      case MessageTypeEnum.REACTION:
        // Real-time reaction update from server
        const reactionPayload = message.payload;
        const reactionMsgId = reactionPayload.messageId;
        const reactionEmoji = reactionPayload.emoji;
        const reactionUserId = reactionPayload.userId;
        const reactionAction = reactionPayload.action;
        
        console.log('💝 [LiveChat] Reaction update:', reactionMsgId, reactionEmoji, reactionAction);
        
        // Find and update the message
        const currentMessages = useChatStore.getState().messages;
        console.log('💝 [LiveChat] Current messages:', currentMessages.map(m => ({ id: m.id, messageId: m.messageId })));
        const targetMessage = currentMessages.find((m: any) => m.messageId === reactionMsgId || m.id === reactionMsgId);
        console.log('💝 [LiveChat] Target message found:', !!targetMessage);
        
        if (targetMessage) {
          const reactions = targetMessage.reactions || [];
          const existingReaction = reactions.find((r: any) => r.emoji === reactionEmoji);
          
          if (reactionAction === 'add') {
            if (existingReaction) {
              // Add user to existing reaction
              if (!existingReaction.users.includes(reactionUserId)) {
                existingReaction.users.push(reactionUserId);
                existingReaction.count = existingReaction.users.length;
              }
            } else {
              // Create new reaction
              reactions.push({
                emoji: reactionEmoji,
                users: [reactionUserId],
                count: 1
              });
            }
          } else if (reactionAction === 'remove') {
            if (existingReaction) {
              existingReaction.users = existingReaction.users.filter((u: string) => u !== reactionUserId);
              existingReaction.count = existingReaction.users.length;
            }
          }
          
          // Update the message in store
          useChatStore.getState().updateMessage(reactionMsgId, { reactions });
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
    console.log('💝 [LiveChat] Sending REACTION:', messageId, emoji);
    send({
      type: MessageTypeEnum.REACTION_ADD,
      payload: { messageId, emoji },
    });
  }, [send]);

  const reportMessage = useCallback((messageId: string, reason: string) => {
    console.log('⚠️ [LiveChat] Reporting message:', messageId, reason);
    send({
      type: MessageTypeEnum.MESSAGE_REPORT,
      payload: { messageId, reason },
    });
  }, [send]);

  const banUser = useCallback((userIdToBan: string, roomId: string) => {
    console.log('🚫 [LiveChat] Banning user:', userIdToBan, 'from room:', roomId);
    send({
      type: MessageTypeEnum.USER_BAN,
      payload: { userIdToBan, roomId },
    });
  }, [send]);

  const deleteMessage = useCallback((messageId: string) => {
    console.log('🗑️  [LiveChat] Deleting message:', messageId);
    send({
      type: MessageTypeEnum.MESSAGE_DELETE,
      payload: { messageId },
    });
  }, [send]);

  const disconnect = useCallback(() => {
    console.log('🔌 [LiveChat] Disconnecting WebSocket...');
    
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    if (pingInterval.current) {
      clearInterval(pingInterval.current);
    }
    // Clear all typing timeouts
    typingTimeouts.current.forEach(timeout => clearTimeout(timeout));
    typingTimeouts.current.clear();
    
    if (ws.current) {
      ws.current.close(1000, 'Manual disconnect'); // Normal closure
      ws.current = null;
    }
    setConnected(false);
  }, [setConnected]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [props.serverUrl, props.apiKey]); // Only reconnect if server URL or API key changes

  return {
    sendMessage,
    sendTyping,
    sendReaction,
    reportMessage,
    banUser,
    deleteMessage,
    disconnect,
    reconnect: connect,
  };
}

