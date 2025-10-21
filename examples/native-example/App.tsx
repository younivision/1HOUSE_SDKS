import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LiveChat } from '@1house/chat-native';

// Generate a random user ID and username for demo
const generateUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;
const userNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
const randomUsername = userNames[Math.floor(Math.random() * userNames.length)];

export default function App() {
  const [userId] = useState(generateUserId());
  const [username] = useState(randomUsername);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showChat, setShowChat] = useState(true);
  
  // Change this to your server URL
  // For physical device: use your computer's IP address
  // For simulator/emulator: use localhost
  const serverUrl = Platform.select({
    ios: 'ws://localhost:8080',
    android: 'ws://10.0.2.2:8080', // Android emulator localhost
    default: 'ws://localhost:8080',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>1HOUSE LiveChat</Text>
          <Text style={styles.subtitle}>React Native Demo</Text>
        </View>
        <TouchableOpacity
          style={styles.themeButton}
          onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Text style={styles.themeButtonText}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {showChat ? (
        <View style={styles.chatContainer}>
          <LiveChat
            serverUrl={serverUrl}
            userId={userId}
            username={username}
            roomId="demo"
            theme={theme}
            onConnect={() => console.log('Connected to chat!')}
            onDisconnect={() => console.log('Disconnected from chat')}
            onMessage={(message) => console.log('New message:', message)}
            onError={(error) => console.error('Chat error:', error)}
          />
        </View>
      ) : (
        <ScrollView style={styles.infoContainer} contentContainerStyle={styles.infoContent}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Welcome to LiveChat Demo!</Text>
            <Text style={styles.infoText}>
              This is a demonstration of the 1HOUSE LiveChat React Native component.
              Open this app on multiple devices to see real-time messaging in action.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoSectionTitle}>Your Details:</Text>
            <Text style={styles.infoDetail}>Username: {username}</Text>
            <Text style={styles.infoDetail}>User ID: {userId}</Text>
            <Text style={styles.infoDetail}>Server: {serverUrl}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoSectionTitle}>Features to Try:</Text>
            <Text style={styles.featureItem}>💬 Send messages in real-time</Text>
            <Text style={styles.featureItem}>🖼️ Upload and share images</Text>
            <Text style={styles.featureItem}>👥 View online users</Text>
            <Text style={styles.featureItem}>⌨️ Typing indicators</Text>
            <Text style={styles.featureItem}>🌓 Toggle themes</Text>
            <Text style={styles.featureItem}>📱 Native mobile experience</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.warningText}>
              ⚠️ Make sure the backend server is running on your local machine or provide a remote server URL.
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowChat(!showChat)}
        >
          <Text style={styles.toggleButtonText}>
            {showChat ? 'Show Info' : 'Show Chat'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'InterDisplay-SemiBold',
      android: 'InterDisplay-SemiBold',
      default: 'InterDisplay-SemiBold',
    }),
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'Poppins-Regular',
    }),
  },
  themeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  themeButtonText: {
    fontSize: 24,
  },
  chatContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  infoContainer: {
    flex: 1,
  },
  infoContent: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'InterDisplay-SemiBold',
      android: 'InterDisplay-SemiBold',
      default: 'InterDisplay-SemiBold',
    }),
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'Poppins-Regular',
    }),
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'InterDisplay-SemiBold',
      android: 'InterDisplay-SemiBold',
      default: 'InterDisplay-SemiBold',
    }),
  },
  infoDetail: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'Poppins-Regular',
    }),
    marginVertical: 4,
  },
  featureItem: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginVertical: 4,
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'Poppins-Regular',
    }),
  },
  warningText: {
    fontSize: 14,
    color: '#f59e0b',
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'Poppins-Regular',
    }),
  },
  footer: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    fontFamily: Platform.select({
      ios: 'Poppins-SemiBold',
      android: 'Poppins-SemiBold',
      default: 'Poppins-SemiBold',
    }),
  },
});

