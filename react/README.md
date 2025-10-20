# @1house/chat-react

React embeddable chat component for 1HOUSE LiveChat with a beautiful Twitch-style UI, automatic image caching, and seamless integration for web applications.

## 🌟 Features

- 🎨 **Twitch-style chat interface** - Modern, sleek design
- 🌓 **Dark & Light themes** - Beautiful themes with smooth transitions
- 🖼️ **Automatic image caching** - Browser-based caching for fast loads
- 💬 **Real-time messaging** - WebSocket-powered instant communication
- 👥 **User list with avatars** - See who's online with profile pictures
- ⌨️ **Typing indicators** - Live typing status
- 📱 **Responsive design** - Works on desktop, tablet, and mobile
- 🎯 **TypeScript support** - Fully typed for better DX
- 🚀 **Zero configuration** - Works out of the box
- 🎭 **Custom avatars** - User profile pictures with fallbacks
- 🎨 **Custom fonts** - Inter & Poppins fonts included
- ⚡ **Optimized performance** - Smooth 60 FPS rendering
- 🔌 **Easy integration** - Drop into any React app

## 📦 Installation

```bash
npm install @1house/chat-react
```

Or with yarn:

```bash
yarn add @1house/chat-react
```

Or with pnpm:

```bash
pnpm add @1house/chat-react
```

### Peer Dependencies

This package requires React 18+:

```bash
npm install react react-dom
```

## 🚀 Quick Start

### Basic Implementation

```jsx
import { LiveChat } from '@1house/chat-react';

function App() {
  return (
    <div style={{ height: '600px' }}>
      <LiveChat
        apiKey="your-api-key"
        userId="user123"
        username="JohnDoe"
      />
    </div>
  );
}

export default App;
```

### With All Options

```jsx
import { LiveChat } from '@1house/chat-react';
import { useState } from 'react';

function App() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    console.log('🟢 Connected to chat!');
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    console.log('🔴 Disconnected from chat');
    setIsConnected(false);
  };

  const handleMessage = (message) => {
    console.log('📨 New message:', message);
    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification(`${message.username}: ${message.content}`);
    }
  };

  const handleError = (error) => {
    console.error('❌ Chat error:', error);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header>
        <h1>My App</h1>
        <span>{isConnected ? '🟢 Online' : '🔴 Offline'}</span>
      </header>
      
      <main style={{ flex: 1 }}>
        <LiveChat
          apiKey="your-api-key"
          userId="user-123"
          username="JohnDoe"
          roomId="gaming-lounge"
          avatar="https://example.com/avatars/johndoe.jpg"
          theme="dark"
          maxHeight="100%"
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onMessage={handleMessage}
          onError={handleError}
        />
      </main>
    </div>
  );
}

export default App;
```

### Sidebar Layout

Perfect for streaming platforms or social apps:

```jsx
import { LiveChat } from '@1house/chat-react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        {/* Your main content */}
        <VideoPlayer />
        <ContentFeed />
      </main>
      
      <aside className="chat-sidebar">
        <LiveChat
          apiKey="your-api-key"
          userId={currentUser.id}
          username={currentUser.name}
          avatar={currentUser.avatar}
          theme="dark"
          maxHeight="100vh"
        />
      </aside>
    </div>
  );
}

export default App;
```

```css
/* App.css */
.app-container {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
}

.chat-sidebar {
  width: 350px;
  border-left: 1px solid #2a2a3e;
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  .chat-sidebar {
    width: 100%;
    height: 300px;
    border-left: none;
    border-top: 1px solid #2a2a3e;
  }
}
```

### Fullscreen Chat

```jsx
import { LiveChat } from '@1house/chat-react';

function ChatPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <LiveChat
        apiKey="your-api-key"
        userId="user123"
        username="ChatUser"
        roomId="general"
        theme="dark"
        maxHeight="100vh"
      />
    </div>
  );
}

export default ChatPage;
```

### With Authentication

```jsx
import { LiveChat } from '@1house/chat-react';
import { useAuth } from './hooks/useAuth';
import { Navigate } from 'react-router-dom';

function ChatPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ height: '100vh' }}>
      <LiveChat
        apiKey={user.token}
        userId={user.id}
        username={user.displayName}
        avatar={user.photoURL}
        roomId="authenticated-room"
        theme={user.preferences?.theme || 'dark'}
      />
    </div>
  );
}

export default ChatPage;
```

## 📋 Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `apiKey` | string | ✅ | - | API key for authentication |
| `userId` | string | ✅ | - | Unique user identifier |
| `username` | string | ✅ | - | Display name for the user |
| `roomId` | string | ❌ | 'default' | Chat room identifier |
| `avatar` | string | ❌ | - | User avatar URL |
| `theme` | 'light' \| 'dark' | ❌ | 'dark' | UI theme |
| `maxHeight` | string | ❌ | '600px' | Maximum container height (CSS value) |
| `onConnect` | () => void | ❌ | - | Callback when WebSocket connects |
| `onDisconnect` | () => void | ❌ | - | Callback when WebSocket disconnects |
| `onMessage` | (message: Message) => void | ❌ | - | Callback for new messages |
| `onError` | (error: Error) => void | ❌ | - | Callback for errors |

> **Note:** The server URL is automatically configured to connect to `https://prod.chat-service.1houseglobalservices.com`. You don't need to specify a server URL.

## 🎨 Themes

### Dark Theme (Default)

```jsx
<LiveChat theme="dark" {...props} />
```

**Colors:**
- Background: `#0f0f23`
- Secondary: `#1a1a2e`
- Text: `#efeff1`
- Accent: Purple/Blue gradients
- Perfect for gaming, streaming, and modern apps

### Light Theme

```jsx
<LiveChat theme="light" {...props} />
```

**Colors:**
- Background: `#ffffff`
- Secondary: `#f7f7f8`
- Text: `#1f1f23`
- Accent: Blue/Purple gradients
- Clean and professional for business apps

### Custom Theme (Coming Soon)

```jsx
<LiveChat
  theme="custom"
  customTheme={{
    background: '#1e1e1e',
    text: '#ffffff',
    accent: '#ff6b6b',
  }}
  {...props}
/>
```

## 🎨 Styling & Customization

### Default Styles

The component comes with built-in styles that you can override:

```css
/* Override container styles */
.livechat-container {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Customize message styles */
.chat-message {
  padding: 12px;
  border-radius: 8px;
}

.chat-message:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Customize input field */
.chat-input {
  border: 2px solid #6441a5;
}

.chat-input:focus {
  border-color: #9147ff;
  box-shadow: 0 0 0 3px rgba(145, 71, 255, 0.1);
}

/* Customize user list */
.user-list-item {
  padding: 8px;
  border-radius: 6px;
}
```

### Inline Styles

```jsx
<div style={{ 
  width: '400px', 
  height: '700px',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
}}>
  <LiveChat {...props} />
</div>
```

### With CSS Modules

```jsx
import styles from './Chat.module.css';

function ChatComponent() {
  return (
    <div className={styles.chatWrapper}>
      <LiveChat {...props} />
    </div>
  );
}
```

```css
/* Chat.module.css */
.chatWrapper {
  width: 100%;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}
```

### With Tailwind CSS

```jsx
function ChatComponent() {
  return (
    <div className="w-full h-screen rounded-lg shadow-2xl border border-gray-800">
      <LiveChat {...props} />
    </div>
  );
}
```

## 🖼️ Image Handling

### Image Caching

The component automatically caches images using browser cache APIs:

```jsx
import { useImageCache } from '@1house/chat-react';

function ImageManager() {
  const { getCachedImage, preloadImage, clearCache } = useImageCache();

  const handlePreload = async () => {
    await preloadImage('https://example.com/image.jpg');
    console.log('✅ Image preloaded and cached');
  };

  const handleClearCache = async () => {
    await clearCache();
    console.log('✅ Cache cleared');
  };

  return (
    <div>
      <button onClick={handlePreload}>Preload Image</button>
      <button onClick={handleClearCache}>Clear Cache</button>
    </div>
  );
}
```

### Custom Avatar Component

```jsx
import { UserAvatar } from '@1house/chat-react';

function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <UserAvatar
        avatar={user.avatar}
        username={user.username}
        size={64}
      />
      <div>
        <h3>{user.username}</h3>
        <p>{user.bio}</p>
      </div>
    </div>
  );
}
```

### Image Upload

```jsx
function ChatWithImageUpload() {
  const { sendMessage } = useWebSocket({ /* config */ });

  const handleImageUpload = async (file) => {
    // Upload to your server
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('https://api.yourapp.com/upload', {
      method: 'POST',
      body: formData,
    });
    
    const { url } = await response.json();
    
    // Send message with image
    sendMessage('Check out this image!', [url]);
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => handleImageUpload(e.target.files[0])} 
      />
    </div>
  );
}
```

## 🔧 Advanced Usage

### Using Hooks Directly

Build completely custom UIs with the provided hooks:

```jsx
import { useWebSocket, useChatStore } from '@1house/chat-react';
import { useState, useEffect } from 'react';

function CustomChat() {
  const [messageText, setMessageText] = useState('');
  
  const { sendMessage, disconnect, startTyping, stopTyping } = useWebSocket({
    apiKey: 'your-api-key',
    userId: 'user123',
    username: 'JohnDoe',
    roomId: 'custom-room',
    onConnect: () => console.log('Connected!'),
    onDisconnect: () => console.log('Disconnected'),
  });

  const { messages, users, isConnected, typingUsers } = useChatStore();

  const handleSend = () => {
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText('');
      stopTyping();
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    if (e.target.value.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  return (
    <div className="custom-chat">
      {/* Status Bar */}
      <div className="status-bar">
        <span className={isConnected ? 'status-online' : 'status-offline'}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
        <span>👥 {users.length} users online</span>
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className="message">
            <img src={msg.avatar} alt={msg.username} />
            <div>
              <strong style={{ color: msg.color }}>{msg.username}</strong>
              <p>{msg.content}</p>
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Typing Indicators */}
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.map(u => u.username).join(', ')} is typing...
        </div>
      )}

      {/* Input */}
      <div className="input-container">
        <input
          type="text"
          value={messageText}
          onChange={handleTyping}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    </div>
  );
}

export default CustomChat;
```

### Store Management

```jsx
import { useChatStore } from '@1house/chat-react';
import { useEffect } from 'react';

function ChatStatistics() {
  const { 
    messages, 
    users, 
    addMessage, 
    clearMessages,
    setUsers 
  } = useChatStore();

  useEffect(() => {
    console.log('Total messages:', messages.length);
    console.log('Active users:', users.length);
  }, [messages.length, users.length]);

  const handleExport = () => {
    const data = JSON.stringify({ messages, users }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-export.json';
    a.click();
  };

  return (
    <div>
      <h3>Chat Statistics</h3>
      <p>Messages: {messages.length}</p>
      <p>Users: {users.length}</p>
      <button onClick={handleExport}>Export Chat</button>
      <button onClick={clearMessages}>Clear Messages</button>
    </div>
  );
}
```

### Multiple Chat Rooms

```jsx
import { LiveChat } from '@1house/chat-react';
import { useState } from 'react';

function MultiRoomChat() {
  const [activeRoom, setActiveRoom] = useState('general');
  const rooms = ['general', 'gaming', 'tech', 'random'];

  return (
    <div className="multi-room-chat">
      <nav className="room-tabs">
        {rooms.map(room => (
          <button
            key={room}
            onClick={() => setActiveRoom(room)}
            className={activeRoom === room ? 'active' : ''}
          >
            #{room}
          </button>
        ))}
      </nav>
      
      <LiveChat
        key={activeRoom} // Force remount on room change
        apiKey="your-api-key"
        userId="user123"
        username="JohnDoe"
        roomId={activeRoom}
        theme="dark"
        maxHeight="calc(100vh - 60px)"
      />
    </div>
  );
}
```

### Notifications

```jsx
import { LiveChat } from '@1house/chat-react';
import { useEffect, useState } from 'react';

function ChatWithNotifications() {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (permission === 'default') {
      Notification.requestPermission().then(setPermission);
    }
  }, []);

  const handleMessage = (message) => {
    // Show notification for new messages
    if (permission === 'granted' && document.hidden) {
      new Notification(`${message.username} says:`, {
        body: message.content,
        icon: message.avatar,
        tag: message.id,
      });
    }
  };

  return (
    <LiveChat
      apiKey="your-api-key"
      userId="user123"
      username="JohnDoe"
      onMessage={handleMessage}
    />
  );
}
```

## 🎭 Custom Fonts

The package includes two beautiful fonts:
- **Inter** - Clean, modern UI font
- **Poppins** - Friendly, rounded font

Fonts are automatically imported with the component.

### Use Custom Fonts

```css
/* Your custom CSS */
.chat-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.chat-message {
  font-family: 'Poppins', sans-serif;
}
```

## 🚀 Performance Optimization

### Code Splitting

```jsx
import { lazy, Suspense } from 'react';

const LiveChat = lazy(() => import('@1house/chat-react').then(m => ({ default: m.LiveChat })));

function App() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <LiveChat {...props} />
    </Suspense>
  );
}
```

### Memoization

```jsx
import { memo } from 'react';
import { LiveChat } from '@1house/chat-react';

const MemoizedChat = memo(LiveChat);

function App() {
  return <MemoizedChat {...props} />;
}
```

### Virtual Scrolling

The component automatically uses virtual scrolling for large message lists to maintain 60 FPS.

### Bundle Size Optimization

```javascript
// Import only what you need
import { LiveChat } from '@1house/chat-react';

// Instead of
import * as Chat from '@1house/chat-react';
```

## 🐛 Troubleshooting

### WebSocket Connection Issues

**Problem:** Cannot connect to WebSocket server

**Solutions:**
1. Verify your API key is correct
2. Check that you have network connectivity
3. Check browser console for errors
4. Ensure the 1HOUSE chat service is operational

### Connection Security

**Note:** The SDK automatically uses secure WebSocket (WSS) connections to the 1HOUSE production servers. All connections are encrypted and secure by default.

### CORS Errors

**Problem:** CORS policy blocks WebSocket connection

**Solution:** Configure CORS on your backend:
```javascript
// In your backend
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true,
}));
```

### Styles Not Loading

**Problem:** Chat component has no styles

**Solution:** Ensure CSS is imported:
```jsx
import '@1house/chat-react/dist/style.css';
import { LiveChat } from '@1house/chat-react';
```

### Font Loading Issues

**Problem:** Fonts not displaying correctly

**Solution:** Fonts are bundled with the package. Ensure you're importing the component correctly:
```jsx
import { LiveChat } from '@1house/chat-react';
// CSS is automatically imported with the component
```

### Performance Issues

**Problem:** Sluggish scrolling or UI lag

**Solutions:**
1. Limit message history (backend configuration)
2. Use `maxHeight` prop to constrain container size
3. Enable hardware acceleration:
```css
.livechat-container {
  transform: translateZ(0);
  will-change: transform;
}
```

### Build Errors

**Problem:** Build fails with module errors

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# For Vite projects
rm -rf node_modules/.vite
npm run dev

# For Create React App
rm -rf node_modules/.cache
npm start
```

## 🔐 Security Best Practices

### 1. Secure API Keys

```jsx
// Store API keys securely
const apiKey = process.env.REACT_APP_CHAT_API_KEY;

<LiveChat apiKey={apiKey} {...props} />
```

### 2. Sanitize User Input

```jsx
import DOMPurify from 'isomorphic-dompurify';

const sanitizeMessage = (text) => {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
  });
};
```

### 3. Implement Authentication

```jsx
const apiKey = localStorage.getItem('auth_token');

<LiveChat
  apiKey={apiKey}
  userId={user.id}
  username={user.name}
/>
```

### 4. Rate Limiting

Implement client-side rate limiting:
```jsx
let messageCount = 0;
let lastReset = Date.now();

const checkRateLimit = () => {
  if (Date.now() - lastReset > 60000) {
    messageCount = 0;
    lastReset = Date.now();
  }
  
  if (messageCount >= 10) {
    throw new Error('Rate limit exceeded. Please slow down.');
  }
  
  messageCount++;
};
```

### 5. XSS Protection

Always sanitize HTML content:
```jsx
import { sanitize } from 'dompurify';

const SafeMessage = ({ content }) => (
  <div dangerouslySetInnerHTML={{ __html: sanitize(content) }} />
);
```

## 📊 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+
- ⚠️ IE 11 (not supported)

### Polyfills

For older browsers, include polyfills:
```bash
npm install core-js regenerator-runtime
```

```javascript
// index.js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

## 📦 Bundle Size

- Package: ~150 KB (minified)
- With dependencies: ~200 KB (minified + gzipped)
- Fonts: ~1 MB
- Total: ~300 KB (gzipped)

### Tree Shaking

The package is tree-shakeable. Only import what you need:
```jsx
import { LiveChat, useWebSocket } from '@1house/chat-react';
```

## 🚀 Deployment

### Vite

```bash
npm run build
npm run preview
```

### Create React App

```bash
npm run build
# Deploy the build/ directory
```

### Next.js

```jsx
// components/Chat.jsx
'use client'; // For Next.js 13+ App Router

import { LiveChat } from '@1house/chat-react';

export default function Chat() {
  return <LiveChat {...props} />;
}
```

### Vercel

```bash
vercel --prod
```

### Netlify

```bash
npm run build
# Deploy the dist/ or build/ directory
```

## 🔧 Development

### Clone Repository

```bash
git clone <repository-url>
cd 1HOUSE_LIVECHAT_REACT
npm install
```

### Development Server

```bash
npm run dev
# Opens at http://localhost:5173
```

### Build Library

```bash
npm run build
# Output in dist/
```

### Type Checking

```bash
npx tsc --noEmit
```

### Preview Build

```bash
npm run preview
```

## 🧪 Testing

### Test Component

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { LiveChat } from '@1house/chat-react';

test('renders chat component', async () => {
  render(
    <LiveChat
      serverUrl="ws://localhost:8080"
      userId="test-user"
      username="TestUser"
    />
  );
  
  await waitFor(() => {
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
  });
});
```

## 📦 Publishing

### Publish to npm

```bash
npm run build
npm version patch  # or minor/major
npm publish --access public
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes with clear commits
4. **Test** thoroughly
5. **Update** documentation
6. **Submit** a pull request

### Development Guidelines

- Use TypeScript
- Follow existing code style
- Add JSDoc comments
- Update README for new features
- Ensure tests pass

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation:** [Full Documentation](https://docs.1house.chat)
- **Issues:** [GitHub Issues](https://github.com/1house/livechat/issues)
- **Discord:** [Join Community](https://discord.gg/1house)
- **Email:** support@1house.chat
- **Stack Overflow:** Tag `1house-chat`

## 🔗 Related Packages

- **[@1house/chat-backend](../1HOUSE_LIVECHAT_API)** - WebSocket backend server
- **[@1house/chat-native](../1HOUSE_LIVECHAT_NATIVE)** - React Native/Expo component

## 💡 Examples

Check out live examples:

- [Basic Chat](https://examples.1house.chat/basic)
- [Streaming Platform](https://examples.1house.chat/streaming)
- [Gaming Integration](https://examples.1house.chat/gaming)
- [E-commerce Support](https://examples.1house.chat/support)

## 📝 Changelog

### v1.0.0
- Initial release
- Dark and light themes
- Real-time messaging
- Image caching
- Typing indicators
- User avatars
- Responsive design
- TypeScript support
- Custom fonts (Inter & Poppins)
- WebSocket auto-reconnection

## 🌟 Acknowledgments

- Built with [React](https://react.dev) 18
- Bundled with [Vite](https://vitejs.dev)
- UI inspired by [Twitch](https://twitch.tv)
- State management with [Zustand](https://github.com/pmndrs/zustand)
- Styled with [Tailwind CSS](https://tailwindcss.com)

## 🎯 Roadmap

- [ ] Voice messages
- [ ] Video calls
- [ ] Screen sharing
- [ ] Message reactions
- [ ] Thread replies
- [ ] File uploads
- [ ] Emoji picker
- [ ] Markdown support
- [ ] Code syntax highlighting
- [ ] @ mentions
- [ ] Message search
- [ ] Custom emojis
- [ ] Moderation tools
- [ ] Analytics dashboard

## 🎉 Happy Chatting!

If you find this package useful, please ⭐️ star it on GitHub!

Built with ❤️ by the 1HOUSE team
