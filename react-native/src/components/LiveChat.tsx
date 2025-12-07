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
import { TipModal } from './TipModal';
import { themes } from '../styles';

export const LiveChat: React.FC<LiveChatProps> = (props) => {
  const { 
    theme = 'dark',
    className = '',
    customStyles = {},
  } = props;
  const { sendMessage, sendTyping, sendTip } = useWebSocket(props);
  const { isConnected, users } = useChatStore();
  const [showUserList, setShowUserList] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const currentTheme = themes[theme];
  
  // Get recipient info - for now, use the first user in the room (or a default)
  // In a real app, this would be the streamer/host
  const recipientId = users.length > 0 ? users[0].userId : undefined;
  const recipientName = users.length > 0 ? users[0].username : 'Streamer';
  
  const handleSendTip = (amount: number, recipientId: string, recipientName: string) => {
    sendTip(amount, recipientId, recipientName);
  };

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
        onTipPress={() => setShowTipModal(true)}
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
      
      <TipModal
        visible={showTipModal}
        onClose={() => setShowTipModal(false)}
        onSendTip={handleSendTip}
        recipientId={recipientId}
        recipientName={recipientName}
        theme={currentTheme}
      />
    </KeyboardAvoidingView>
  );
};

