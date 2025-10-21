# React Example - 1HOUSE LiveChat

A complete example implementation of the 1HOUSE LiveChat React component.

## Getting Started

### 1. Start the Backend Server

First, make sure the WebSocket backend is running:

```bash
# From the root of the monorepo
npm run dev:backend
```

The server will start on `ws://localhost:8080`.

### 2. Run the React Example

In a new terminal:

```bash
# From the root of the monorepo
cd examples/react-example
npm install
npm run dev
```

The example will be available at `http://localhost:3000`.

### 3. Test Real-time Features

Open `http://localhost:3000` in multiple browser windows to test:
- Real-time messaging
- User presence
- Typing indicators
- Image sharing
- Theme switching

## Features Demonstrated

✅ **Basic Integration**: Shows how to embed the LiveChat component  
✅ **Theme Switching**: Toggle between light and dark themes  
✅ **User Management**: Random user generation for testing  
✅ **Event Handlers**: Connect, disconnect, message, and error callbacks  
✅ **Responsive Design**: Works on desktop and mobile  
✅ **Image Caching**: Automatic image optimization and caching  

## Code Structure

```
src/
├── App.tsx         # Main application with LiveChat integration
├── App.css         # Styling for the demo app
├── main.tsx        # React entry point
└── index.css       # Global styles
```

## Customization

### Change Server URL

Edit `src/App.tsx`:

```tsx
const [serverUrl] = useState('ws://your-server.com');
```

### Customize Theme

The component supports both light and dark themes:

```tsx
<LiveChat
  theme="dark" // or "light"
  // ... other props
/>
```

### Add Custom Callbacks

```tsx
<LiveChat
  onConnect={() => {
    console.log('Connected!');
    // Your custom logic
  }}
  onMessage={(message) => {
    console.log('New message:', message);
    // Your custom logic
  }}
  // ... other props
/>
```

## Building for Production

```bash
npm run build
npm run preview
```

## Troubleshooting

**Chat not connecting?**
- Ensure the backend server is running on `localhost:8080`
- Check browser console for WebSocket errors
- Verify firewall settings

**Images not loading?**
- Check that the image cache is working
- Verify image URLs are accessible
- Look for CORS errors in console

## Learn More

- [React SDK Documentation](../../packages/react/README.md)
- [Backend Documentation](../../packages/backend/README.md)
- [Main Project README](../../README.md)

