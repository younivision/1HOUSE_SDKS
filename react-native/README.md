# @1house/chat-native

React Native/Expo chat component for 1HOUSE LiveChat with a beautiful Twitch-style UI, optimized for mobile with advanced image caching and native performance.

## 🌟 Features

- 🎨 **Twitch-style mobile UI** - Beautiful, modern chat interface
- 🌓 **Dark & Light themes** - Seamless theme switching
- 🖼️ **Automatic image caching** - Powered by Expo FileSystem for optimal performance
- 💬 **Real-time messaging** - WebSocket-based instant communication
- 👥 **User list with avatars** - See who's online
- ⌨️ **Typing indicators** - Know when others are typing
- 📱 **Native mobile experience** - Smooth 60 FPS scrolling
- 🎯 **Full TypeScript support** - Type-safe development
- 📸 **Image picker integration** - Send images from camera or gallery
- 🔄 **Auto-reconnection** - Seamless connection recovery
- 🎭 **User avatars** - Profile pictures with fallbacks
- 🎨 **Custom fonts** - Inter & Poppins fonts included
- ⚡ **Optimized for mobile networks** - Efficient data usage

## 📦 Installation

```bash
npm install @1house/chat-native
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-native expo
```

### Additional Expo Modules

Install required Expo modules:

```bash
npx expo install expo-file-system expo-image expo-image-picker expo-font
```

### For Bare React Native Projects

If you're using a bare React Native project (not Expo Go):

```bash
npx expo install expo-file-system expo-image expo-image-picker expo-font
npx pod-install  # iOS only
```

## 🚀 Quick Start

### Basic Implementation

```jsx
import { LiveChat } from '@1house/chat-native';
import { SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LiveChat
        serverUrl="ws://your-server.com"
        userId="user123"
        username="JohnDoe"
      />
    </SafeAreaView>
  );
}
```

### With All Options

```jsx
import { LiveChat } from '@1house/chat-native';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function App() {
  const handleConnect = () => {
    console.log('🟢 Connected to chat!');
  };

  const handleDisconnect = () => {
    console.log('🔴 Disconnected from chat');
  };

  const handleMessage = (message) => {
    console.log('📨 New message:', message);
    // You can trigger notifications here
  };

  const handleError = (error) => {
    console.error('❌ Chat error:', error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LiveChat
        serverUrl="wss://your-production-server.com"
        userId="user-123"
        username="JohnDoe"
        roomId="gaming-lounge"
        avatar="https://example.com/avatars/johndoe.jpg"
        theme="dark"
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onMessage={handleMessage}
        onError={handleError}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
});
```

### Split Screen Layout

Perfect for streaming apps or games:

```jsx
import { View, StyleSheet } from 'react-native';
import { LiveChat } from '@1house/chat-native';

export default function GameScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.gameArea}>
        {/* Your game or main content */}
        <GameComponent />
      </View>
      
      <View style={styles.chatArea}>
        <LiveChat
          serverUrl="ws://localhost:8080"
          userId={user.id}
          username={user.name}
          avatar={user.avatar}
          theme="dark"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  gameArea: {
    flex: 2,
  },
  chatArea: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#2a2a3e',
  },
});
```

### With User Authentication

```jsx
import { LiveChat } from '@1house/chat-native';
import { useAuth } from './hooks/useAuth';

export default function ChatScreen() {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <LiveChat
      serverUrl="wss://chat.yourapp.com"
      userId={user.id}
      username={user.displayName}
      avatar={user.photoURL}
      roomId="default"
      theme={user.preferences.theme || 'dark'}
    />
  );
}
```

## 📋 Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `serverUrl` | string | ✅ | - | WebSocket server URL (ws:// or wss://) |
| `userId` | string | ✅ | - | Unique user identifier |
| `username` | string | ✅ | - | Display name for the user |
| `roomId` | string | ❌ | 'default' | Chat room identifier |
| `avatar` | string | ❌ | - | User avatar URL |
| `theme` | 'light' \| 'dark' | ❌ | 'dark' | UI theme |
| `onConnect` | () => void | ❌ | - | Callback when connected |
| `onDisconnect` | () => void | ❌ | - | Callback when disconnected |
| `onMessage` | (message: Message) => void | ❌ | - | Callback for new messages |
| `onError` | (error: Error) => void | ❌ | - | Callback for errors |

## 🎨 Themes

The component comes with two built-in themes:

### Dark Theme (Default)
```jsx
<LiveChat theme="dark" {...props} />
```
- Background: `#0f0f23`
- Text: `#efeff1`
- Accents: Purple/Blue gradients
- Perfect for gaming and streaming apps

### Light Theme
```jsx
<LiveChat theme="light" {...props} />
```
- Background: `#ffffff`
- Text: `#1f1f23`
- Accents: Blue/Purple gradients
- Clean and professional

## 🖼️ Image Caching

The component uses Expo's FileSystem API for efficient image caching:

### Features
- ✅ Automatic caching on first load
- ✅ Persistent cache between app sessions
- ✅ Optimized for mobile networks
- ✅ Smart cache management
- ✅ Background image loading
- ✅ Fallback avatars for failed loads

### Manual Cache Management

```jsx
import { useImageCache } from '@1house/chat-native';
import { View, Button, Text } from 'react-native';

function CacheManager() {
  const { getCacheSize, clearCache } = useImageCache();

  const handleClearCache = async () => {
    try {
      const size = await getCacheSize();
      console.log(`Cache size: ${(size / 1024 / 1024).toFixed(2)} MB`);
      
      await clearCache();
      console.log('Cache cleared successfully!');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  return (
    <View>
      <Button title="Clear Image Cache" onPress={handleClearCache} />
    </View>
  );
}
```

### Preload Images

```jsx
import { useImageCache } from '@1house/chat-native';
import { useEffect } from 'react';

function PreloadImages({ imageUrls }) {
  const { preloadImages } = useImageCache();

  useEffect(() => {
    // Preload images in background
    preloadImages(imageUrls);
  }, [imageUrls]);

  return null;
}
```

## 📸 Image Picker

Users can send images from their camera or gallery:

### Automatic Setup

The image picker is built-in and activated by tapping the image icon in the input field.

### Permissions

The component automatically requests permissions when needed, but you should add descriptions to your app.json:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photos to share in chat",
          "cameraPermission": "Allow $(PRODUCT_NAME) to use your camera to take photos for chat"
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "We need access to your photo library to send images in chat",
        "NSCameraUsageDescription": "We need access to your camera to take photos for chat"
      }
    },
    "android": {
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "CAMERA"
      ]
    }
  }
}
```

## 🔧 Advanced Usage

### Using Hooks Directly

Build your own custom UI with the provided hooks:

```jsx
import { useWebSocket, useChatStore } from '@1house/chat-native';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import { useState } from 'react';

function CustomChat() {
  const [messageText, setMessageText] = useState('');
  
  const { sendMessage, disconnect } = useWebSocket({
    serverUrl: 'ws://your-server.com',
    userId: 'user123',
    username: 'JohnDoe',
    roomId: 'custom-room',
  });

  const { messages, users, isConnected } = useChatStore();

  const handleSend = () => {
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Status Bar */}
      <View style={{ padding: 10, backgroundColor: isConnected ? '#4caf50' : '#f44336' }}>
        <Text style={{ color: 'white' }}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </Text>
        <Text style={{ color: 'white' }}>
          👥 {users.length} users online
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={msg => msg.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: 'bold', color: item.color }}>
              {item.username}
            </Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />

      {/* Input */}
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, padding: 8 }}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}
```

### Custom Avatar Component

```jsx
import { UserAvatar } from '@1house/chat-native';
import { View, Text } from 'react-native';

function UserProfile({ user }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <UserAvatar
        avatar={user.avatar}
        username={user.username}
        size={100}
      />
      <Text>{user.username}</Text>
    </View>
  );
}
```

### Store Access

```jsx
import { useChatStore } from '@1house/chat-native';
import { useEffect } from 'react';

function ChatStats() {
  const { messages, users, addMessage, setUsers } = useChatStore();

  useEffect(() => {
    console.log('Total messages:', messages.length);
    console.log('Active users:', users.length);
  }, [messages.length, users.length]);

  return (
    <View>
      <Text>Messages: {messages.length}</Text>
      <Text>Users: {users.length}</Text>
    </View>
  );
}
```

## 🎭 Fonts

The package includes custom fonts:
- **Inter** - Modern, clean UI font
- **Poppins** - Friendly, rounded font

Fonts are automatically loaded when the component mounts.

## 📱 Platform-Specific Configuration

### iOS Simulator
```javascript
serverUrl: "ws://localhost:8080"
```

### Android Emulator
```javascript
serverUrl: "ws://10.0.2.2:8080"
```

### Physical Devices
```javascript
// Find your computer's local IP
// macOS: ipconfig getifaddr en0
// Windows: ipconfig
// Linux: hostname -I

serverUrl: "ws://192.168.1.XXX:8080"
```

### Production
```javascript
serverUrl: "wss://your-domain.com"
```

## 🐛 Troubleshooting

### WebSocket Connection Issues

**Problem:** Can't connect to WebSocket server

**Solutions:**
1. Verify server URL format (`ws://` or `wss://`)
2. Check that backend server is running
3. For iOS simulator, use `localhost`
4. For Android emulator, use `10.0.2.2`
5. For physical devices, use your computer's local IP
6. Check firewall settings
7. Ensure CORS is properly configured on server

**Test connection:**
```javascript
const testConnection = async () => {
  try {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => console.log('✅ Connection successful');
    ws.onerror = (e) => console.error('❌ Connection failed:', e);
  } catch (error) {
    console.error('❌ Error:', error);
  }
};
```

### Image Caching Not Working

**Problem:** Images not caching or loading slowly

**Solutions:**
1. Verify Expo FileSystem is installed: `npx expo install expo-file-system`
2. Check app permissions for file access
3. Clear cache manually: `clearCache()`
4. Ensure images are accessible (valid URLs)
5. Check network connectivity

**Test cache:**
```javascript
import * as FileSystem from 'expo-file-system';

const testCache = async () => {
  const cacheDir = FileSystem.cacheDirectory + 'chat-images/';
  const info = await FileSystem.getInfoAsync(cacheDir);
  console.log('Cache exists:', info.exists);
};
```

### Image Picker Permissions

**Problem:** Can't access camera or gallery

**Solutions:**
1. Add permissions to `app.json` (see Permissions section)
2. Request permissions manually:
```javascript
import * as ImagePicker from 'expo-image-picker';

const requestPermissions = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission required!');
  }
};
```

### Font Loading Issues

**Problem:** Fonts not loading

**Solutions:**
1. Ensure `expo-font` is installed
2. Fonts are loaded automatically by the component
3. If using custom fonts, preload them:
```javascript
import * as Font from 'expo-font';

await Font.loadAsync({
  'Inter-Regular': require('./fonts/Inter/Inter-Regular.ttf'),
});
```

### Performance Issues

**Problem:** Sluggish scrolling or UI lag

**Solutions:**
1. Limit message history (backend configuration)
2. Use `FlatList` with `windowSize` prop
3. Optimize images (smaller sizes)
4. Enable JS debugger in Release mode
5. Check for memory leaks

**Performance tips:**
- Keep message history under 500 messages
- Resize images before uploading
- Use production build for testing
- Profile with React DevTools

### Build Errors

**Problem:** Build fails with module errors

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install

# For iOS
cd ios && pod install && cd ..

# Clear Expo cache
npx expo start -c
```

## 🎯 Performance Optimization

### Message Rendering
- Messages are rendered using `FlatList` with optimized props
- Automatic scroll-to-bottom on new messages
- Virtualized list for large message counts

### Image Optimization
- Images are cached locally
- Lazy loading for off-screen images
- Automatic image compression
- Fallback avatars for failed loads

### Network Efficiency
- WebSocket compression
- Batched message updates
- Automatic reconnection with exponential backoff
- Typing indicator debouncing

## 🔐 Security Best Practices

1. **Use WSS in Production**
   ```javascript
   serverUrl: "wss://secure-domain.com"
   ```

2. **Validate User Input**
   ```javascript
   const sanitizeMessage = (text) => {
     return text.trim().slice(0, 5000); // Max length
   };
   ```

3. **Implement Authentication**
   ```javascript
   // Add API key or JWT token
   serverUrl: "wss://domain.com?token=user-jwt-token"
   ```

4. **Handle Sensitive Data**
   - Never log user credentials
   - Use secure storage for tokens
   - Validate image URLs

## 📊 Bundle Size

- Package size: ~250 KB
- With dependencies: ~2 MB
- Fonts: ~1 MB
- Total impact: ~3-4 MB

## 🚀 Development

### Clone Repository
```bash
git clone <repository-url>
cd 1HOUSE_LIVECHAT_NATIVE
npm install
```

### Start Development Server
```bash
npm run dev
# or
npx expo start
```

### Run on Specific Platform
```bash
npm run ios        # iOS Simulator
npm run android    # Android Emulator
npm run web        # Web browser (experimental)
```

### Build for Production
```bash
# Development build
npx expo build:android
npx expo build:ios

# Production build (EAS)
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

### Type Checking
```bash
npx tsc --noEmit
```

## 🧪 Testing

### Manual Testing
```bash
# Start backend server
cd ../1HOUSE_LIVECHAT_API
npm run dev

# Start Expo app
cd ../1HOUSE_LIVECHAT_NATIVE
npm run dev
```

### Test on Multiple Devices
```bash
# Use Expo Go app
# Scan QR code from terminal
```

## 📦 Publishing

### Publish to npm
```bash
npm run build
npm publish --access public
```

### Update Version
```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly on iOS and Android
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- Use TypeScript
- Follow Expo/React Native conventions
- Add proper type definitions
- Comment complex logic
- Update documentation

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation:** [Full Documentation](https://docs.1house.chat)
- **Issues:** [GitHub Issues](https://github.com/1house/livechat/issues)
- **Discord:** [Join Community](https://discord.gg/1house)
- **Email:** support@1house.chat

## 🔗 Related Packages

- **[@1house/chat-backend](../1HOUSE_LIVECHAT_API)** - WebSocket backend server
- **[@1house/chat-react](../1HOUSE_LIVECHAT_REACT)** - React web component

## 💡 Examples

Check out example implementations:
- [Basic Chat App](./examples/basic)
- [Gaming Integration](./examples/gaming)
- [Streaming App](./examples/streaming)

## 📝 Changelog

### v1.0.0
- Initial release
- Dark and light themes
- Image caching with Expo FileSystem
- Image picker integration
- Typing indicators
- User avatars
- Real-time messaging
- Auto-reconnection
- Custom fonts (Inter & Poppins)
- Full TypeScript support

## 🌟 Acknowledgments

- Built with [Expo](https://expo.dev)
- UI inspired by [Twitch](https://twitch.tv)
- Uses [Zustand](https://github.com/pmndrs/zustand) for state management
- Styled with [NativeWind](https://www.nativewind.dev/)

## 🎉 Happy Chatting!

If you find this package useful, please give it a ⭐️ on GitHub!
