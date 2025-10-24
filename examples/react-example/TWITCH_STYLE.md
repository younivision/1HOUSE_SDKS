# 🎮 Twitch-Style Live Chat Example

This example demonstrates how to create a Twitch-style streaming interface with overlay chat using the 1HOUSE LiveChat React component.

## ✨ Features

- **Video Player**: Full-screen video player with sample content
- **Overlay Chat**: Chat overlay positioned on the right side of the video
- **Stream Header**: Streamer information, viewer count, and live status
- **Interactive Controls**: Follow button and chat toggle
- **Responsive Design**: Mobile-friendly layout
- **Real-time Chat**: Full chat functionality with the LiveChat component

## 🎯 Key Components

### Stream Header
- Streamer avatar and name
- Live stream title
- Viewer count (simulated)
- Follow/Following button
- Chat toggle button

### Video Area
- Full-screen video player
- Stream overlay alerts
- Responsive video sizing

### Chat Overlay
- Positioned on the right side
- Semi-transparent background
- Collapsible chat interface
- Full LiveChat component integration

## 🚀 Getting Started

1. Make sure the backend is running:
   ```bash
   npm run dev:backend
   ```

2. Start the React example:
   ```bash
   cd examples/react-example
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser

## 📱 Mobile Experience

- On mobile devices, the chat overlay becomes full-screen
- Touch-friendly controls
- Responsive video player
- Optimized for portrait and landscape orientations

## 🎨 Customization

The Twitch-style layout can be easily customized:

- **Colors**: Modify the CSS variables for different themes
- **Layout**: Adjust the chat overlay width and position
- **Video**: Replace with your own video content
- **Stream Info**: Update streamer details and metadata

## 🔧 Technical Details

- Built with React and TypeScript
- Uses Vite for fast development
- Integrates with 1HOUSE LiveChat SDK
- Responsive CSS with Flexbox and Grid
- WebSocket connection for real-time chat

## 📺 Demo Features

- **Sample Videos**: Multiple demo videos to test with
- **Simulated Viewer Count**: Dynamic viewer count updates
- **Stream Alerts**: Animated follower notifications
- **Interactive Follow Button**: Toggle follow state
- **Chat Toggle**: Show/hide chat overlay

This example showcases how to build a professional streaming interface similar to Twitch, YouTube Live, or other streaming platforms using the 1HOUSE LiveChat system.
