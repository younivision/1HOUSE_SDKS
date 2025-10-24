import { useEffect, useState } from 'react';

const API_KEY = import.meta.env.VITE_LIVECHAT_SDK_KEY || 'lc_30c955dd7b53f5a07d2c16a70271c6eef888286b2c0984daee0054abe3262205';
const SERVER_URL = 'http://localhost:8080';

export function Debug() {
  const [logs, setLogs] = useState<string[]>([]);
  const [wsStatus, setWsStatus] = useState('Not connected');

  const log = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    // Test 1: Check backend health
    fetch(`${SERVER_URL}/health`)
      .then(res => res.json())
      .then(data => log(`✅ Backend health: ${JSON.stringify(data)}`))
      .catch(err => log(`❌ Backend health check failed: ${err.message}`));

    // Test 2: Check messages endpoint
    fetch(`${SERVER_URL}/rooms/lobby/messages?limit=5`, {
      headers: { 'X-API-Key': API_KEY }
    })
      .then(res => res.json())
      .then(data => log(`✅ Messages API: Found ${data.messages?.length || 0} messages`))
      .catch(err => log(`❌ Messages API failed: ${err.message}`));

    // Test 3: WebSocket connection
    const wsUrl = `ws://localhost:8080?apiKey=${API_KEY}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      log('✅ WebSocket connected');
      setWsStatus('Connected');

      // Send CONNECT message
      const connectMsg = {
        type: 'CONNECT',
        payload: {
          userId: 'test_user',
          username: 'Test User',
          roomId: 'lobby'
        }
      };
      log(`📤 Sending CONNECT: ${JSON.stringify(connectMsg)}`);
      ws.send(JSON.stringify(connectMsg));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      log(`📨 WebSocket message: ${data.type} - ${JSON.stringify(data.payload).substring(0, 100)}`);
    };

    ws.onerror = (error) => {
      log(`❌ WebSocket error: ${error}`);
      setWsStatus('Error');
    };

    ws.onclose = () => {
      log('⚠️  WebSocket closed');
      setWsStatus('Closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h2>LiveChat Debug Console</h2>
      <div style={{ marginBottom: '20px' }}>
        <strong>WebSocket Status:</strong> {wsStatus}
      </div>
      <div style={{ 
        background: '#1a1a1a', 
        color: '#00ff00', 
        padding: '10px', 
        borderRadius: '5px',
        maxHeight: '600px',
        overflow: 'auto'
      }}>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}

