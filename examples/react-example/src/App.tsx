import { useState } from 'react';
import { LiveChat } from '@1house/chat-react';
import '@1house/chat-react/dist/style.css';
import './App.css';
import { Debug } from './Debug';

// Generate a random user ID and username for demo
const generateUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;
const userNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
const randomUsername = userNames[Math.floor(Math.random() * userNames.length)];

function App() {
  const [userId] = useState(generateUserId());
  const [username] = useState(randomUsername);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [serverUrl] = useState('ws://localhost:8080');
  const [role] = useState<'user' | 'moderator' | 'admin'>('admin'); // Set to 'admin' to test all features

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>1HOUSE LiveChat</h1>
          <p className="subtitle">React Example</p>
        </div>
        <div className="header-controls">
          <button 
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="app-content">
        <main className="main-content">
          <Debug />
          <div className="demo-info">
            <h2>Welcome to the Live Chat Demo!</h2>
            <p>
              This is a demonstration of the 1HOUSE LiveChat React component.
              Open this page in multiple browser windows to see real-time messaging in action.
            </p>
            <div className="user-info">
              <strong>Your Details:</strong>
              <ul>
                <li>Username: {username}</li>
                <li>User ID: {userId}</li>
                <li>Server: {serverUrl}</li>
              </ul>
            </div>
            <div className="instructions">
              <h3>Features to Try:</h3>
              <ul>
                <li>💬 Send messages and see them appear in real-time</li>
                <li>🖼️ Upload and share images</li>
                <li>👥 View the list of online users</li>
                <li>⌨️ Typing indicators (start typing to see)</li>
                <li>🌓 Toggle between light and dark themes</li>
                <li>📱 Resize your window to see responsive design</li>
              </ul>
            </div>
          </div>
        </main>

        <aside className="chat-sidebar">
          <LiveChat
            apiKey={import.meta.env.VITE_LIVECHAT_SDK_KEY || "lc_3e41d2f1276acdb315f02ee60f9fc013b0da996b43942c984be6dbc7836327cb"}
            serverUrl={serverUrl}
            userId={userId}
            username={username}
            roomId="lobby"
            role={role}
            theme={theme}
            maxHeight="calc(100vh - 80px)"
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
          />
        </aside>
      </div>

      <footer className="app-footer">
        <p>
          Make sure the backend server is running on <code>localhost:8080</code>
        </p>
        <p className="hint">
          Start it with: <code>npm run dev:backend</code>
        </p>
      </footer>
    </div>
  );
}

export default App;

