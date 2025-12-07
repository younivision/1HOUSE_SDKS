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
  const isTip = message.type === 'tip';

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View 
      className="flex-row p-3 mb-2 rounded-lg"
      style={{ 
        backgroundColor: isTip ? 'rgba(38, 159, 71, 0.1)' : theme.messageBackground,
        borderWidth: isTip ? 1 : 0,
        borderColor: isTip ? 'rgba(38, 159, 71, 0.3)' : 'transparent',
      }}
    >
      {!isOwn && (
        <View className={`${isTip ? 'w-10 h-10' : 'w-8 h-8'} rounded-full mr-3 overflow-hidden`}>
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
              style={{ backgroundColor: isTip ? '#269f47' : message.color }}
            >
              {isTip ? (
                <Text style={{ color: 'white', fontSize: 18 }}>💚</Text>
              ) : (
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600', fontFamily: fonts.semiBold }}>
                  {message.username.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      <View className="flex-1">
        <View className="flex-row items-center mb-1 flex-wrap">
          <Text style={[{ 
            color: isTip ? '#269f47' : message.color, 
            fontSize: 14, 
            fontWeight: isTip ? '700' : '600', 
            fontFamily: isTip ? fonts.displaySemiBold : fonts.displaySemiBold, 
            marginRight: 8 
          }]}>
            {message.username}
          </Text>
          {isTip && message.tip && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(38, 159, 71, 0.2)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              marginRight: 8,
            }}>
              <Text style={{ color: '#269f47', fontSize: 12, marginRight: 4 }}>💚</Text>
              <Text style={{ color: '#269f47', fontSize: 12, fontWeight: '700', fontFamily: fonts.semiBold }}>
                {message.tip.amount} tokens
              </Text>
            </View>
          )}
          <Text style={[{ color: theme.textSecondary, fontSize: 12, fontFamily: fonts.regular }]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>

        <Text style={[{ 
          color: theme.text, 
          fontSize: 14, 
          lineHeight: 20, 
          fontFamily: fonts.regular,
          fontWeight: isTip ? '500' : '400',
        }]}>
          {message.content}
        </Text>
        
        {isTip && message.tip && (
          <Text style={[{ 
            color: '#269f47', 
            fontSize: 12, 
            marginTop: 4,
            fontFamily: fonts.regular,
            opacity: 0.8,
          }]}>
            💚 Tip to {message.tip.recipientName}
          </Text>
        )}

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


