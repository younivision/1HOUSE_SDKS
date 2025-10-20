import React, { useRef, useEffect } from 'react';
import { FlatList, View, Text } from 'react-native';
import { useChatStore } from '../store';
import { ChatMessage } from './ChatMessage';
import { Theme, fonts } from '../styles';

interface ChatMessagesProps {
  userId: string;
  theme: Theme;
  customStyles?: any;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ userId, theme, customStyles }) => {
  const { messages } = useChatStore();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChatMessage 
          message={item} 
          isOwn={item.userId === userId}
          theme={theme}
        />
      )}
      contentContainerStyle={{ padding: 8, flexGrow: 1 }}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center p-5">
          <Text style={[{ color: theme.textSecondary, fontFamily: fonts.regular, fontSize: 14, textAlign: 'center' }]}>
            No messages yet. Start the conversation! 💬
          </Text>
        </View>
      }
      style={[{ flex: 1 }, customStyles]}
    />
  );
};

