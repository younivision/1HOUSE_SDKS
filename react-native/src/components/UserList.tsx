import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useChatStore } from '../store';
import { useImageCache } from '../hooks/useImageCache';
import { Theme, fonts } from '../styles';
import { User } from '../types';

interface UserListProps {
  theme: Theme;
  customStyles?: any;
}

export const UserList: React.FC<UserListProps> = ({ theme, customStyles }) => {
  const { users } = useChatStore();
  const { getCachedImage } = useImageCache();

  const renderUser = ({ item }: { item: User }) => (
    <View 
      className="flex-row items-center p-2 mb-1 rounded"
      style={{ backgroundColor: theme.messageBackground }}
    >
      <View className="w-6 h-6 rounded-full mr-2 overflow-hidden">
        {item.avatar ? (
          <Image
            source={{ uri: getCachedImage(item.avatar) }}
            className="w-full h-full"
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View 
            className="w-full h-full justify-center items-center"
            style={{ backgroundColor: item.color }}
          >
            <Text style={{ color: 'white', fontSize: 11, fontWeight: '600', fontFamily: fonts.semiBold }}>
              {item.username.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <Text 
        className="flex-1 text-[13px]"
        style={{ color: theme.text, fontFamily: fonts.regular }}
        numberOfLines={1}
      >
        {item.username}
      </Text>
    </View>
  );

  return (
    <View 
      className="w-[180px] border-l p-3"
      style={[{ backgroundColor: theme.sidebarBackground, borderLeftColor: theme.border }, customStyles]}
    >
      <Text 
        className="text-xs font-semibold mb-3 uppercase"
        style={{ color: theme.textSecondary, fontFamily: fonts.displaySemiBold, letterSpacing: 0.5 }}
      >
        Online ({users.length})
      </Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.userId}
        renderItem={renderUser}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};


