import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme, fonts } from '../styles';

interface ChatHeaderProps {
  isConnected: boolean;
  userCount: number;
  showUserList: boolean;
  onToggleUserList: () => void;
  onTipPress?: () => void;
  theme: Theme;
}

interface ChatHeaderPropsExtended extends ChatHeaderProps {
  customStyles?: any;
}

export const ChatHeader: React.FC<ChatHeaderPropsExtended> = ({
  isConnected,
  userCount,
  showUserList,
  onToggleUserList,
  onTipPress,
  theme,
  customStyles,
}) => {
  return (
    <View 
      className="flex-row justify-between items-center p-3 border-b"
      style={[{ backgroundColor: theme.headerBackground, borderBottomColor: theme.border }, customStyles]}
    >
      <View className="flex-row items-center">
        <View 
          className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}
        />
        <Text 
          className="text-base font-semibold"
          style={[{ color: theme.text, fontFamily: fonts.displaySemiBold }]}
        >
          Live Chat
        </Text>
      </View>
      
      <View className="flex-row items-center gap-2">
        {onTipPress && (
          <TouchableOpacity
            className="px-3 py-1.5 rounded-full flex-row items-center"
            style={{ backgroundColor: '#269f47' }}
            onPress={onTipPress}
          >
            <Text style={{ color: 'white', fontSize: 16, marginRight: 4 }}>💚</Text>
            <Text style={[{ color: 'white', fontFamily: fonts.semiBold, fontSize: 14 }]}>
              Tip
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="px-3 py-1.5 rounded"
          style={{ backgroundColor: theme.inputBackground }}
          onPress={onToggleUserList}
        >
          <Text style={[{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }]}>
            👥 {userCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

