import React, { useState, useRef, useEffect } from 'react';
import { LiveChatProps } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';
import { useChatStore } from '../store';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { UserList } from './UserList';
import '../styles.css';

export const LiveChat: React.FC<LiveChatProps> = (props) => {
  const { 
    theme = 'dark', 
    maxHeight = '600px',
    className = '',
    customStyles = {},
  } = props;
  const { sendMessage, sendTyping, sendReaction, reportMessage, banUser, deleteMessage } = useWebSocket(props);
  const { messages, users, isConnected, isTyping } = useChatStore();
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div 
      className={`flex flex-col w-full h-full font-sans rounded-lg overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-chat-dark-bg text-chat-dark-text' : 'bg-white text-gray-900'} ${className}`} 
      style={{ maxHeight, ...customStyles.container }}
    >
      {/* Header */}
      <div 
        className={`flex justify-between items-center px-4 py-3 border-b ${theme === 'dark' ? 'bg-chat-dark-header border-chat-dark-border' : 'bg-gray-50 border-gray-200'}`}
        style={customStyles.header}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
          <h3 className="text-base font-semibold font-display tracking-tight m-0">Live Chat</h3>
        </div>
        <button 
          className={`px-3 py-1.5 rounded font-medium text-sm transition-all ${theme === 'dark' ? 'bg-chat-dark-input hover:bg-opacity-80' : 'bg-gray-100 hover:bg-gray-200'}`}
          onClick={() => setShowUserList(!showUserList)}
        >
          👥 {users.length}
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages */}
        <div 
          className="flex-1 overflow-y-auto p-2 flex flex-col gap-1"
          style={customStyles.messages}
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full opacity-50">
              <p className="font-sans">No messages yet. Start the conversation! 💬</p>
            </div>
          )}
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isOwn={message.userId === props.userId}
              theme={theme}
              customStyles={customStyles.message}
              onReaction={sendReaction}
              onReport={reportMessage}
              onDelete={deleteMessage}
              currentUserId={props.userId}
              isAdmin={props.role === 'admin' || props.role === 'moderator'}
            />
          ))}
          
          {/* Typing Indicator */}
          {Array.from(isTyping.entries()).filter(([userId]) => userId !== props.userId).length > 0 && (
            <div className={`px-3 py-2 flex items-center gap-2 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-sans italic">
                {Array.from(isTyping.entries())
                  .filter(([userId]) => userId !== props.userId)
                  .map(([userId]) => users.find(u => u.userId === userId)?.username || 'Someone')
                  .join(', ')} {Array.from(isTyping.entries()).filter(([userId]) => userId !== props.userId).length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* User list sidebar */}
        {showUserList && (
          <div 
            className={`w-52 border-l overflow-y-auto ${theme === 'dark' ? 'bg-chat-dark-header border-chat-dark-border' : 'bg-gray-50 border-gray-200'}`}
            style={customStyles.userList}
          >
            <UserList 
              users={users} 
              theme={theme} 
              customStyles={customStyles.userList}
              currentUserId={props.userId}
              isAdmin={props.role === 'admin' || props.role === 'moderator'}
              onBanUser={(userId) => banUser(userId, props.roomId || 'default')}
            />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput 
        onSend={sendMessage}
        onTyping={sendTyping}
        disabled={!isConnected}
        theme={theme}
        customStyles={customStyles.input}
      />
    </div>
  );
};

