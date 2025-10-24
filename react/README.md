# @1house/chat-react

React embeddable chat component for 1HOUSE LiveChat with Twitch-style UI and image caching.

## Features

- 🎨 Twitch-style chat interface
- 📺 **NEW: TwitchStream component** - Complete streaming interface with video/iframe support
- 🌓 Dark & Light themes
- 🖼️ Automatic image caching
- 💬 Real-time messaging
- 👥 User list with avatars
- ⌨️ Typing indicators
- 📱 Responsive design
- 🎯 TypeScript support

## Installation

```bash
npm install @1house/chat-react
```

## Usage

### TwitchStream Component (NEW!)

The `TwitchStream` component provides a complete Twitch-style streaming interface with integrated chat:

```jsx
import { TwitchStream } from '@1house/chat-react';

function App() {
  return (
    <TwitchStream
      // LiveChat props
      apiKey="your-api-key"
      serverUrl="ws://localhost:8080"
      userId="user123"
      username="viewer"
      roomId="lobby"
      
      // Stream info
      streamTitle="Live Coding Session - Building a Chat App"
      streamerName="DeveloperName"
      viewerCount={150}
      isLive={true}
      
      // Video content
      videoSrc="https://example.com/stream.mp4"
      autoPlay={true}
      muted={true}
      
      // Customization
      streamerAvatar="https://example.com/avatar.jpg"
      chatWidth="24rem"
      headerColor="#171719"
    />
  );
}
```

### Basic LiveChat Implementation

```jsx
import { LiveChat } from '@1house/chat-react';

function App() {
  return (
    <LiveChat
      serverUrl="ws://localhost:8080"
      userId="user123"
      username="JohnDoe"
    />
  );
}
```

### With All Options

```jsx
import { LiveChat } from '@1house/chat-react';

function App() {
  return (
    <LiveChat
      serverUrl="ws://localhost:8080"
      userId="user123"
      username="JohnDoe"
      roomId="gaming"
      avatar="https://example.com/avatar.jpg"
      theme="dark"
      maxHeight="600px"
      onConnect={() => console.log('Connected!')}
      onDisconnect={() => console.log('Disconnected')}
      onMessage={(message) => console.log('New message:', message)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

### Embedded in a Layout

```jsx
<div style={{ display: 'flex', height: '100vh' }}>
  <main style={{ flex: 1 }}>
    {/* Your main content */}
  </main>
  <aside style={{ width: '350px' }}>
    <LiveChat
      serverUrl="ws://localhost:8080"
      userId={currentUser.id}
      username={currentUser.name}
      avatar={currentUser.avatar}
      theme="dark"
      maxHeight="100vh"
    />
  </aside>
</div>
```

## Props

### TwitchStream Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| **LiveChat Props** | | | | |
| `apiKey` | string | ✅ | - | LiveChat API key |
| `serverUrl` | string | ✅ | - | WebSocket server URL |
| `userId` | string | ✅ | - | Unique user identifier |
| `username` | string | ✅ | - | Display name |
| `roomId` | string | ❌ | 'lobby' | Chat room ID |
| `role` | 'user' \| 'moderator' \| 'admin' | ❌ | 'user' | User role |
| `theme` | 'light' \| 'dark' | ❌ | 'dark' | Chat theme |
| `maxHeight` | string | ❌ | '100%' | Maximum chat height |
| `onConnect` | () => void | ❌ | - | Connection callback |
| `onDisconnect` | () => void | ❌ | - | Disconnection callback |
| `onMessage` | (message) => void | ❌ | - | New message callback |
| `onError` | (error) => void | ❌ | - | Error callback |
| **Stream Props** | | | | |
| `streamTitle` | string | ✅ | - | Main stream title |
| `streamerName` | string | ✅ | - | Streamer's name |
| `viewerCount` | number | ❌ | 0 | Current viewer count |
| `isLive` | boolean | ❌ | true | Whether stream is live |
| **Video/Content Props** | | | | |
| `videoSrc` | string | ❌ | - | Video source URL |
| `iframeSrc` | string | ❌ | - | Iframe source URL (alternative to video) |
| `videoPoster` | string | ❌ | - | Video poster image |
| `autoPlay` | boolean | ❌ | true | Auto-play video |
| `muted` | boolean | ❌ | true | Mute video by default |
| `loop` | boolean | ❌ | true | Loop video |
| `controls` | boolean | ❌ | true | Show video controls |
| `videoFit` | 'contain' \| 'cover' \| 'fill' \| 'scale-down' \| 'none' | ❌ | 'cover' | Video scaling behavior |
| `hideControlsForEmbedded` | boolean | ❌ | false | Hide video controls for embedded use |
| **Customization Props** | | | | |
| `streamerAvatar` | string | ❌ | - | Streamer avatar image URL |
| `showChatToggle` | boolean | ❌ | true | Show chat toggle button |
| `chatWidth` | string | ❌ | '24rem' | Chat overlay width |
| `headerColor` | string | ❌ | '#171719' | Header background color |
| `className` | string | ❌ | - | Additional CSS classes |
| **Fullscreen Props** | | | | |
| `showFullscreenButton` | boolean | ❌ | true | Show fullscreen button |
| `fullscreenButtonPosition` | 'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' | ❌ | 'top-right' | Fullscreen button position |
| **Typography Props** | | | | |
| `titleFontSize` | string | ❌ | '1.125rem' | Stream title font size |
| `detailsFontSize` | string | ❌ | '0.875rem' | Details text font size |
| `streamerNameFontSize` | string | ❌ | '0.875rem' | Streamer name font size |
| **Chat Props** | | | | |
| `chatSize` | 'sm' \| 'md' \| 'lg' \| 'xl' | ❌ | 'md' | Chat message size |
| `chatAnimation` | boolean | ❌ | true | Enable chat slide animations |
| **Resize and Container Props** | | | | |
| `width` | string \| number | ❌ | '100%' | Container width |
| `height` | string \| number | ❌ | '100vh' | Container height |
| `minWidth` | string \| number | ❌ | '320px' | Minimum container width |
| `minHeight` | string \| number | ❌ | '200px' | Minimum container height |
| `maxWidth` | string \| number | ❌ | 'none' | Maximum container width |
| `maxHeight` | string \| number | ❌ | 'none' | Maximum container height |
| `resizable` | boolean | ❌ | false | Enable manual resizing |
| `containerStyle` | React.CSSProperties | ❌ | - | Additional container styles |

### LiveChat Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `serverUrl` | string | ✅ | - | WebSocket server URL |
| `userId` | string | ✅ | - | Unique user identifier |
| `username` | string | ✅ | - | Display name |
| `roomId` | string | ❌ | 'default' | Chat room ID |
| `avatar` | string | ❌ | - | User avatar URL |
| `theme` | 'light' \| 'dark' | ❌ | 'dark' | UI theme |
| `maxHeight` | string | ❌ | '600px' | Maximum container height |
| `onConnect` | () => void | ❌ | - | Connection callback |
| `onDisconnect` | () => void | ❌ | - | Disconnection callback |
| `onMessage` | (message) => void | ❌ | - | New message callback |
| `onError` | (error) => void | ❌ | - | Error callback |

## Advanced Usage

### Using Hooks Directly

```jsx
import { useWebSocket, useChatStore } from '@1house/chat-react';

function CustomChat() {
  const { sendMessage } = useWebSocket({
    serverUrl: 'ws://localhost:8080',
    userId: 'user123',
    username: 'JohnDoe'
  });

  const { messages, users, isConnected } = useChatStore();

  return (
    <div>
      <h3>Custom Chat UI</h3>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <div>Users: {users.length}</div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.username}: {msg.content}</div>
      ))}
    </div>
  );
}
```

### Image Caching

```jsx
import { useImageCache } from '@1house/chat-react';

function CustomAvatar({ imageUrl }) {
  const { getCachedImage, preloadImage } = useImageCache();

  // Preload image
  useEffect(() => {
    preloadImage(imageUrl);
  }, [imageUrl]);

  return <img src={getCachedImage(imageUrl)} alt="Avatar" />;
}
```

## Styling

The component comes with built-in styles. If you need to customize, you can override the CSS classes:

```css
.livechat-container {
  /* Your custom styles */
}

.chat-message {
  /* Custom message styles */
}
```

## Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build
npm run build
```

## License

MIT

