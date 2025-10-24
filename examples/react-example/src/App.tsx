import { useState, useRef, useEffect } from 'react';
import { LiveChat, TwitchStream } from '@1houseglobal/chat-react';
import '@1houseglobal/chat-react/style.css';
import './App.css';
import { Debug } from './Debug';

// Generate a random user ID and username for demo
const generateUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;
const userNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
const randomUsername = userNames[Math.floor(Math.random() * userNames.length)];

function App() {
  const [userId] = useState(generateUserId());
  const [username] = useState(randomUsername);
  const [role] = useState<'user' | 'moderator' | 'admin'>('admin');
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 1000) + 100);
  const [showDemoLayout, setShowDemoLayout] = useState(true);

  // Sample video sources for demo
  const videoSources = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  ];
  const [currentVideo] = useState(videoSources[0]);

  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Demo layout with header, sidebar, and embedded TwitchStream
  if (showDemoLayout) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col">
        {/* Demo Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Demo App</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Live</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Settings
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Demo Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>
              <nav className="space-y-2">
                <a href="#" className="block px-3 py-2 bg-blue-50 text-blue-700 rounded-md">Dashboard</a>
                <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Streams</a>
                <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Analytics</a>
                <a href="#" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">Settings</a>
              </nav>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>User joined chat</div>
                <div>New follower</div>
                <div>Message sent</div>
              </div>
            </div>
          </aside>

          {/* Main Content Area with Embedded TwitchStream */}
          <main className="flex-1 flex flex-col">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Stream</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <TwitchStream
                  // LiveChat props
                  apiKey={(import.meta as any).env.VITE_LIVECHAT_SDK_KEY || "lc_30c9....."}
                  userId={userId}
                  username={username}
                  roomId="lobby"
                  role={role}
                  theme="dark"
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
                  streamTitle="Bryce Thompson - Onboarding Call"
                  streamerName="1House Global"
                  // viewerCount={viewerCount}
                  isLive={true}

                  // Video content
                  videoSrc={currentVideo}
                  videoPoster="https://via.placeholder.com/1280x720/1f1f23/ffffff?text=Live+Stream"
                  autoPlay={true}
                  muted={true}
                  loop={true}
                  controls={true}
                  hideControlsForEmbedded={true}

                  showLiveIndicator={false}

                  // Customization for embedded use
                  streamerAvatar="https://via.placeholder.com/40x40/9146ff/ffffff?text=ST"
                  showChatToggle={true}
                  chatWidth="20rem"
                  headerColor="#171719"
                  
                  // Chat customization
                  chatSize="sm"
                  chatAnimation={true}
                  
                  // Typography for smaller embedded view
                  titleFontSize="1rem"
                  detailsFontSize="0.75rem"
                  streamerNameFontSize="0.75rem"
                  
                  // Container sizing
                  width="100%"
                  height="800px"
                  minHeight="500px"
                  maxHeight="700px"
                />
              </div>
            </div>
          </main>
        </div>

        {/* Toggle Button */}
        <button
          className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => setShowDemoLayout(false)}
        >
          Switch to Full Screen
        </button>
      </div>
    );
  }

  // Full-screen TwitchStream component
  return (
    <div className="relative">
      <TwitchStream
                  // LiveChat props
                  apiKey={(import.meta as any).env.VITE_LIVECHAT_SDK_KEY || "lc_30c955dd7b53f5a07d2c16a70271c6eef888286b2c0984daee0054abe3262205"}
                  userId={userId}
        username={username}
        roomId="lobby"
        role={role}
        theme="dark"
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
        viewerCount={viewerCount}
        isLive={true}

        // Video content
        videoSrc={currentVideo}
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
        
        // Full-screen sizing
        width="100vw"
        height="100vh"
      />
      
      {/* Toggle Button */}
      <button
        className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={() => setShowDemoLayout(true)}
      >
        Switch to Demo Layout
      </button>
    </div>
  );
}

export default App;

