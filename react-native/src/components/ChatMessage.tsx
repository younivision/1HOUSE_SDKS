import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Message } from '../types';
import { useImageCache } from '../hooks/useImageCache';
import { Theme, fonts } from '../styles';

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  theme: Theme;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwn, theme }) => {
  const { getCachedImage } = useImageCache();

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View 
      className="flex-row p-2 mb-1 rounded"
      style={{ backgroundColor: theme.messageBackground }}
    >
      {!isOwn && (
        <View className="w-8 h-8 rounded-full mr-3 overflow-hidden">
          {message.avatar ? (
            <Image
              source={{ uri: getCachedImage(message.avatar) }}
              className="w-full h-full"
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <View 
              className="w-full h-full justify-center items-center"
              style={{ backgroundColor: message.color }}
            >
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '600', fontFamily: fonts.semiBold }}>
                {message.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      )}

      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text style={[{ color: message.color, fontSize: 14, fontWeight: '600', fontFamily: fonts.displaySemiBold, marginRight: 8 }]}>
            {message.username}
          </Text>
          <Text style={[{ color: theme.textSecondary, fontSize: 12, fontFamily: fonts.regular }]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>

        <Text style={[{ color: theme.text, fontSize: 14, lineHeight: 20, fontFamily: fonts.regular }]}>
          {message.content}
        </Text>

        {message.images && message.images.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-2">
            {message.images.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: getCachedImage(img) }}
                className="w-[150px] h-[150px] rounded"
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};


