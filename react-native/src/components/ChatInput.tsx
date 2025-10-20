import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Theme, fonts } from '../styles';

interface ChatInputProps {
  onSend: (content: string, images?: string[]) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  theme: Theme;
  customStyles?: any;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onTyping,
  disabled,
  theme,
  customStyles,
}) => {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleChange = (text: string) => {
    setMessage(text);

    // Typing indicator
    onTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1000);
  };

  const handleSubmit = () => {
    if (message.trim() || images.length > 0) {
      onSend(message.trim(), images.length > 0 ? images : undefined);
      setMessage('');
      setImages([]);
      onTyping(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View 
      className="px-3 py-2 border-t"
      style={[{ backgroundColor: theme.inputContainerBackground, borderTopColor: theme.border }, customStyles]}
    >
      {images.length > 0 && (
        <ScrollView
          horizontal
          className="max-h-20 mb-2"
          showsHorizontalScrollIndicator={false}
        >
          {images.map((img, idx) => (
            <View key={idx} className="w-15 h-15 mr-2 rounded overflow-hidden relative">
              <Image
                source={{ uri: img }}
                className="w-full h-full"
                contentFit="cover"
              />
              <TouchableOpacity
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 justify-center items-center"
                onPress={() => removeImage(idx)}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', fontFamily: fonts.bold }}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View className="flex-row items-end">
        <TouchableOpacity
          className="w-9 h-9 rounded justify-center items-center mx-1"
          style={{ backgroundColor: theme.inputBackground }}
          onPress={pickImage}
          disabled={disabled}
        >
          <Text className="text-lg">📎</Text>
        </TouchableOpacity>

        <TextInput
          className="flex-1 min-h-[36px] max-h-[100px] px-3 py-2 rounded text-sm"
          style={{ 
            backgroundColor: theme.inputBackground, 
            color: theme.text,
            fontFamily: fonts.regular,
          }}
          value={message}
          onChangeText={handleChange}
          placeholder={disabled ? 'Connecting...' : 'Type a message...'}
          placeholderTextColor={theme.textSecondary}
          editable={!disabled}
          multiline
          maxLength={5000}
        />

        <TouchableOpacity
          className="w-9 h-9 rounded justify-center items-center mx-1 bg-chat-primary"
          style={{ opacity: disabled || (!message.trim() && images.length === 0) ? 0.4 : 1 }}
          onPress={handleSubmit}
          disabled={disabled || (!message.trim() && images.length === 0)}
        >
          <Text className="text-lg">🚀</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


