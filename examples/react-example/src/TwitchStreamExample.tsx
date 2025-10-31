import React from 'react';
import { TwitchStream } from '@1houseglobal/chat-react';

// Generate a random user ID and username for demo
const generateUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;
const userNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
const randomUsername = userNames[Math.floor(Math.random() * userNames.length)];

export const TwitchStreamExample: React.FC = () => {
  const userId = generateUserId();
  const username = randomUsername;

  // Sample video sources for demo
  const videoSources = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  ];

  return (
    <TwitchStream
      // LiveChat props
      apiKey={"lc_30c955*******"}
      userId={userId}
      username={username}
      roomId="lobby"
      role="admin"
      theme="dark"
      maxHeight="100%"
      onConnect={() => {
        console.log('✅ Connected to chat!');
      }}
      onDisconnect={() => {
        console.log('⚠️  Disconnected from chat');
      }}
      onMessage={(message) => {
        console.log('📨 New message received:', message);
      }}
      onError={(error) => {
        console.error('❌ Chat error:', error);
      }}

      // Stream info
      streamTitle="Live Coding Session - Building a Chat App"
      streamerName="DeveloperName"
      viewerCount={Math.floor(Math.random() * 1000) + 100}
      isLive={true}

      // Video content
      videoSrc={videoSources[0]}
      videoPoster="https://via.placeholder.com/1280x720/1f1f23/ffffff?text=Live+Stream"
      autoPlay={true}
      muted={true}
      loop={true}
      controls={true}

      // Customization
      streamerAvatar="https://via.placeholder.com/40x40/9146ff/ffffff?text=ST"
      showChatToggle={true}
      chatWidth="24rem"
      headerColor="#171719"
    />
  );
};
