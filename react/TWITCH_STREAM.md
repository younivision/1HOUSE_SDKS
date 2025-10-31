# TwitchStream Component

A reusable Twitch-style streaming interface component that combines video/iframe content with live chat functionality.

## Features

- **Twitch-style Layout**: Full-screen streaming interface with overlay chat
- **Flexible Video Support**: Supports both video elements and iframes
- **Live Chat Integration**: Built-in LiveChat component with customizable positioning
- **Customizable Header**: Stream title, streamer info, viewer count, and live status
- **Responsive Design**: Mobile-friendly with adaptive chat overlay
- **Theme Support**: Dark theme with customizable colors
- **Interactive Elements**: Chat toggle, streamer avatar, and overlay notifications

## Basic Usage

```tsx
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

## Props

### LiveChat Props
All standard LiveChat props are supported:
- `apiKey`: Your LiveChat API key
- `serverUrl`: WebSocket server URL
- `userId`: Unique user identifier
- `username`: Display username
- `roomId`: Chat room identifier
- `role`: User role ('user' | 'moderator' | 'admin')
- `theme`: Chat theme ('light' | 'dark')
- `maxHeight`: Maximum chat height
- `onConnect`: Connection callback
- `onDisconnect`: Disconnection callback
- `onMessage`: Message callback
- `onError`: Error callback

### Stream Props
- `streamTitle`: Main stream title (required)
- `streamerName`: Streamer's name (required)
- `viewerCount`: Current viewer count (default: 0)
- `isLive`: Whether stream is live (default: true)

### Video/Content Props
- `videoSrc`: Video source URL
- `iframeSrc`: Iframe source URL (alternative to video)
- `videoPoster`: Video poster image
- `autoPlay`: Auto-play video (default: true)
- `muted`: Mute video by default (default: true)
- `loop`: Loop video (default: true)
- `controls`: Show video controls (default: true)
- `videoFit`: Video scaling behavior (default: 'cover')
- `hideControlsForEmbedded`: Hide video controls for embedded use (default: false)

### Customization Props
- `streamerAvatar`: Streamer avatar image URL
- `showChatToggle`: Show chat toggle button (default: true)
- `chatWidth`: Chat overlay width (default: '24rem')
- `headerColor`: Header background color (default: '#171719')
- `className`: Additional CSS classes

### Fullscreen Props
- `showFullscreenButton`: Show fullscreen button (default: true)
- `fullscreenButtonPosition`: Button position (default: 'top-right')

### Typography Props
- `titleFontSize`: Stream title font size (default: '1.125rem')
- `detailsFontSize`: Details text font size (default: '0.875rem')
- `streamerNameFontSize`: Streamer name font size (default: '0.875rem')

### Chat Props
- `chatSize`: Chat message size - 'sm', 'md', 'lg', 'xl' (default: 'md')
- `chatAnimation`: Enable chat slide animations (default: true)

### Resize and Container Props
- `width`: Container width (default: '100%')
- `height`: Container height (default: '100vh')
- `minWidth`: Minimum container width (default: '320px')
- `minHeight`: Minimum container height (default: '200px')
- `maxWidth`: Maximum container width (default: 'none')
- `maxHeight`: Maximum container height (default: 'none')
- `resizable`: Enable manual resizing (default: false)
- `containerStyle`: Additional container styles

## Examples

### Video Stream
```tsx
<TwitchStream
  apiKey="lc_your_key_here"
  serverUrl="ws://localhost:8080"
  userId="user123"
  username="viewer"
  roomId="lobby"
  streamTitle="Gaming Stream - Fortnite"
  streamerName="GamerPro"
  videoSrc="https://example.com/gameplay.mp4"
  streamerAvatar="https://example.com/gamer-avatar.jpg"
  viewerCount={250}
/>
```

### Iframe Embed
```tsx
<TwitchStream
  apiKey="lc_your_key_here"
  serverUrl="ws://localhost:8080"
  userId="user123"
  username="viewer"
  roomId="lobby"
  streamTitle="YouTube Live Stream"
  streamerName="YouTuber"
  iframeSrc="https://www.youtube.com/embed/live_stream_id"
  streamerAvatar="https://example.com/youtuber-avatar.jpg"
  viewerCount={500}
/>
```

### Custom Styling
```tsx
<TwitchStream
  // ... other props
  headerColor="#1a1a1a"
  chatWidth="20rem"
  className="custom-stream-container"
  showChatToggle={false}
/>
```

### Resizable Container
```tsx
<TwitchStream
  // ... other props
  width="800px"
  height="600px"
  resizable={true}
  minWidth="400px"
  minHeight="300px"
  maxWidth="1200px"
  maxHeight="800px"
/>
```

### Embedded in Different Layouts
```tsx
// Full-screen mode
<TwitchStream
  // ... other props
  width="100vw"
  height="100vh"
/>

// Fixed size widget (default cover behavior)
<TwitchStream
  // ... other props
  width="400px"
  height="300px"
  chatWidth="15rem"
  // videoFit="cover" is default - fills container
/>

// When you need to see entire video without clipping
<div style={{ width: '100%', height: '50vh' }}>
  <TwitchStream
    // ... other props
    width="100%"
    height="100%"
    videoFit="contain"  // Shows entire video, may have letterboxing
  />
</div>
```

### Video Scaling Options
```tsx
// Default: Fill container (professional streaming look)
<TwitchStream videoFit="cover" />

// Show entire video (no clipping, may have letterboxing)
<TwitchStream videoFit="contain" />

// Scale down if needed (never scales up)
<TwitchStream videoFit="scale-down" />
```

### Fullscreen Functionality
```tsx
// Default fullscreen button (top-right)
<TwitchStream showFullscreenButton={true} />

// Custom fullscreen button position
<TwitchStream 
  showFullscreenButton={true}
  fullscreenButtonPosition="bottom-left"
/>

// Hide fullscreen button
<TwitchStream showFullscreenButton={false} />
```

### Video Controls for Embedded Use
```tsx
// Hide video controls for embedded/clean look
<TwitchStream 
  hideControlsForEmbedded={true}
  controls={true}  // This will be overridden to false
/>

// Show video controls (default behavior)
<TwitchStream controls={true} />
```

### Chat Size and Animations
```tsx
// Small chat for embedded use
<TwitchStream 
  chatSize="sm"
  chatAnimation={true}
/>

// Large chat for full-screen
<TwitchStream 
  chatSize="lg"
  chatAnimation={true}
/>

// Disable animations for performance
<TwitchStream 
  chatSize="md"
  chatAnimation={false}
/>
```

### Mobile Responsive
The component automatically adapts to mobile screens:
- Chat overlay becomes full-screen on mobile
- Touch-friendly controls
- Responsive typography

## Styling

The component uses Tailwind CSS classes and includes:
- Dark theme by default
- Custom animations for notifications
- Responsive design breakpoints
- Global CSS resets for proper layout

## Integration

1. Install the package:
```bash
npm install @1house/chat-react
```

2. Import and use:
```tsx
import { TwitchStream } from '@1house/chat-react';
import '@1house/chat-react/dist/style.css';
```

3. Configure your LiveChat backend and API key

4. Customize the component with your stream content and styling

## Browser Support

- Modern browsers with ES6+ support
- WebSocket support for chat functionality
- Video/iframe support for content display
- CSS Grid and Flexbox support for layout
