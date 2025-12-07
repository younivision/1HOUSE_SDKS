import React from 'react';
import ReactDOM from 'react-dom/client';
import { LiveChat, TwitchStream } from './index';
import './index.css';
import './styles.css';

// Generate a random username for demo
const userNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
const randomUsername = userNames[Math.floor(Math.random() * userNames.length)];

const API_KEY = "";
const API_GATEWAY_KEY = "";
const ROOM_ID = "";
const USER_ID = "";
const HOST_ID = "";

function App() {
  const [userId] = React.useState(USER_ID);
  const [hostId] = React.useState(HOST_ID);
  const [username] = React.useState(randomUsername);
  const [view, setView] = React.useState<'livechat' | 'twitch'>('twitch');
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  const videoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Control Panel */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">1HOUSE LiveChat Library - Dev Mode</h1>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Component:</label>
              <select
                value={view}
                onChange={(e) => setView(e.target.value as any)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              >
                <option value="livechat">LiveChat</option>
                <option value="twitch">TwitchStream</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div className="ml-auto text-xs text-gray-500">
              User: {username} (ID: {userId}) | Room: {ROOM_ID}
            </div>
          </div>
        </div>
      </div>

      {/* Component Display */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 h-full">
        {view === 'livechat' && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">LiveChat Component</h2>
            </div>
            <div className="h-[calc(100vh-200px)] min-h-[600px]">
              <LiveChat
                apiKey={API_KEY}
                userId={userId}
                username={username}
                roomId={ROOM_ID}
                role="admin"
                theme={theme}
                maxHeight="100%"
                onConnect={() => console.log('✅ LiveChat connected')}
                onDisconnect={() => console.log('⚠️ LiveChat disconnected')}
                onMessage={(msg) => console.log('📨 LiveChat message:', msg)}
                onError={(err) => console.error('❌ LiveChat error:', err)}
              />
            </div>
          </div>
        )}

        {view === 'twitch' && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">TwitchStream Component</h2>
            </div>
            <div className="flex-1 min-h-0">
              <TwitchStream
                apiKey={API_KEY}
                userId={userId}
                username={username}
                roomId={ROOM_ID}
                hostId={hostId}
                role="admin"
                theme={theme}
                streamTitle="Library Dev Mode - Testing Components"
                streamerName="Test Streamer"
                viewerCount={1234}
                isLive={true}
                videoSrc={videoSrc}
                videoPoster="https://via.placeholder.com/1280x720/1f1f23/ffffff?text=Live+Stream"
                autoPlay={true}
                muted={true}
                loop={true}
                controls={true}
                showChatToggle={true}
                chatWidth="24rem"
                chatSize="md"
                chatAnimation={true}
                headerColor="#171719"
                width="100%"
                height="100%"
                apiGateway={{
                  baseUrl: 'https://api-gateway.dev.1houseglobalservices.com',
                  apiKey: API_GATEWAY_KEY,
                }}
                onConnect={() => console.log('✅ TwitchStream connected')}
                onDisconnect={() => console.log('⚠️ TwitchStream disconnected')}
                onMessage={(msg) => console.log('📨 TwitchStream message:', msg)}
                onError={(err) => console.error('❌ TwitchStream error:', err)}
              />
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

