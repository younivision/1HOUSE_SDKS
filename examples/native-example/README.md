# React Native/Expo Example - 1HOUSE LiveChat

A complete example implementation of the 1HOUSE LiveChat React Native component using Expo.

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- For iOS: Xcode and iOS Simulator
- For Android: Android Studio and Android Emulator
- For physical devices: Expo Go app installed

### 1. Start the Backend Server

First, make sure the WebSocket backend is running:

```bash
# From the root of the monorepo
npm run dev:backend
```

The server will start on `ws://localhost:8080`.

### 2. Configure Server URL

For **physical devices**, you need to update the server URL in `App.tsx` to use your computer's local IP address:

```tsx
// Replace localhost with your computer's IP
const serverUrl = 'ws://192.168.1.XXX:8080';
```

To find your IP:
- **macOS**: `ipconfig getifaddr en0` or check System Preferences > Network
- **Windows**: `ipconfig` and look for IPv4 Address
- **Linux**: `ip addr show` or `ifconfig`

### 3. Run the Example

```bash
# From the root of the monorepo
cd examples/native-example
npm install

# Start Expo development server
npm start

# Or run directly on platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
```

### 4. Test on Device

1. Install [Expo Go](https://expo.dev/client) on your phone
2. Scan the QR code from the terminal
3. The app will open in Expo Go

## Features Demonstrated

✅ **Basic Integration**: Shows how to use LiveChat in React Native  
✅ **Theme Switching**: Toggle between light and dark themes  
✅ **User Management**: Random user generation for testing  
✅ **Image Picker**: Upload images from device gallery  
✅ **Native Performance**: Optimized for mobile devices  
✅ **Image Caching**: FileSystem-based image caching  
✅ **Keyboard Handling**: Proper keyboard avoidance  
✅ **Safe Areas**: Respects device notches and navigation  

## Platform-Specific Notes

### iOS

- Requires iOS 13.0 or later
- Image picker permission automatically requested
- Works on both simulator and physical devices

### Android

- Requires Android 5.0 (API 21) or later
- Uses Android emulator localhost alias (`10.0.2.2`)
- Image picker permission automatically requested

### Web

You can also run this example in a web browser:

```bash
npm run web
```

## Code Structure

```
├── App.tsx           # Main application with LiveChat
├── app.json          # Expo configuration
├── babel.config.js   # Babel configuration
└── tsconfig.json     # TypeScript configuration
```

## Customization

### Change Server URL

Edit `App.tsx`:

```tsx
const serverUrl = Platform.select({
  ios: 'ws://your-server.com',
  android: 'ws://your-server.com',
  default: 'ws://your-server.com',
});
```

### Customize Theme

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

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

Or use EAS Build for modern Expo projects:

```bash
eas build --platform ios
eas build --platform android
```

## Troubleshooting

**Chat not connecting on Android Emulator?**
- Use `10.0.2.2` instead of `localhost` for the server URL
- Ensure the backend is accessible from your network

**Chat not connecting on Physical Device?**
- Use your computer's local IP address, not localhost
- Ensure both devices are on the same Wi-Fi network
- Check firewall settings on your computer

**Images not uploading?**
- Permissions are automatically requested when needed
- Check app settings if you denied permissions
- On iOS: Settings > [App Name] > Photos
- On Android: Settings > Apps > [App Name] > Permissions

**"Unable to resolve module" errors?**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start --clear
```

## Learn More

- [React Native SDK Documentation](../../packages/native/README.md)
- [Backend Documentation](../../packages/backend/README.md)
- [Expo Documentation](https://docs.expo.dev/)
- [Main Project README](../../README.md)

