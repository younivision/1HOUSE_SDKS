import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LiveChatProps } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';
import { useChatStore } from '../store';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { UserList } from './UserList';
import { themes } from '../styles';

export const LiveChat: React.FC<LiveChatProps> = (props) => {
  const { 
    theme = 'dark',
    className = '',
    customStyles = {},
  } = props;
  const { sendMessage, sendTyping } = useWebSocket(props);
  const { isConnected, users } = useChatStore();
  const [showUserList, setShowUserList] = useState(false);
  const currentTheme = themes[theme];

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${className}`}
      style={[{ backgroundColor: currentTheme.background }, customStyles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ChatHeader
        isConnected={isConnected}
        userCount={users.length}
        showUserList={showUserList}
        onToggleUserList={() => setShowUserList(!showUserList)}
        theme={currentTheme}
        customStyles={customStyles.header}
      />

      <View className="flex-1 flex-row" style={customStyles.messages}>
        <ChatMessages 
          userId={props.userId} 
          theme={currentTheme}
          customStyles={customStyles.message}
        />
        
        {showUserList && (
          <UserList 
            theme={currentTheme}
            customStyles={customStyles.userList}
          />
        )}
      </View>

      <ChatInput
        onSend={sendMessage}
        onTyping={sendTyping}
        disabled={!isConnected}
        theme={currentTheme}
        customStyles={customStyles.input}
      />
    </KeyboardAvoidingView>
  );
};

