# AI-Powered Video Subtitle Editor

A React Native mobile application that allows users to upload videos, automatically generate subtitles using AI, and edit them through an intuitive interface.

## 🎯 Project Overview

**Student:** Vinayak Singh  
**Project Type:** College Project (Mobile Application Development)  
**Completion Status:** ~40% Complete

## 📱 Features Implemented (40% Complete)

### ✅ Completed Features

- **Video Upload System**: Support for multiple video formats (MP4, MOV, MKV, AVI, WMV)
- **Video Player**: Integrated video player with play/pause controls
- **Subtitle Generation**: Mock AI subtitle generation (placeholder for OpenAI Whisper API)
- **Subtitle Editor**: Interactive editor for modifying subtitle text and timing
- **Real-time Preview**: Live subtitle overlay on video during playback
- **Export Functionality**: Export subtitles in SRT and VTT formats
- **Modern UI**: Clean, professional interface with proper navigation

### 🚧 In Progress / Planned Features

- **Real OpenAI Whisper API Integration**: Actual AI-powered subtitle generation
- **Advanced Styling Options**: Font customization, colors, positioning
- **Cloud Storage**: Firebase integration for project saving/loading
- **Video Export**: Burn subtitles directly into video files
- **Multiple Language Support**: Support for various languages
- **Batch Processing**: Process multiple videos at once

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **Video Handling**: expo-av
- **File System**: expo-document-picker, expo-file-system
- **Icons**: @expo/vector-icons
- **AI Service**: OpenAI Whisper API (to be integrated)
- **Storage**: AsyncStorage / Firebase (planned)

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on device)

### Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd subtitle-editor
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/emulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press 'i' for iOS simulator
   - Or press 'a' for Android emulator

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── HomeScreen.tsx  # Landing page with upload
│   ├── VideoEditorScreen.tsx  # Video preview and AI generation
│   └── SubtitleEditorScreen.tsx  # Subtitle editing interface
├── services/           # Business logic and API calls
│   └── AISubtitleService.ts  # AI integration and export utilities
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces and types
└── App.tsx            # Main app component with navigation
```

## 🔧 Configuration

### OpenAI API Setup (Not Yet Implemented)

To enable real AI subtitle generation:

1. Get OpenAI API key from https://platform.openai.com/
2. Replace placeholder in `src/services/AISubtitleService.ts`:
   ```typescript
   const OPENAI_API_KEY = "your-actual-api-key-here";
   ```

### Firebase Setup (Planned)

For cloud storage and user authentication:

1. Create Firebase project
2. Add configuration to the app
3. Enable Authentication and Firestore

## 🎨 UI/UX Design

- **Color Scheme**: Purple primary (#4C1D95) with clean grays
- **Typography**: System fonts with proper hierarchy
- **Layout**: Mobile-first responsive design
- **Accessibility**: Proper contrast ratios and touch targets

## 📱 Screenshots & Demo

The app includes:

- Clean home screen with feature highlights
- Video upload with drag-and-drop interface
- Professional video player with subtitle overlay
- Intuitive subtitle editing with real-time preview
- Export options for multiple formats

## 🚀 Future Enhancements (Remaining 60%)

### High Priority

1. **Real AI Integration**: Implement actual OpenAI Whisper API calls
2. **Cloud Storage**: Firebase integration for project persistence
3. **Advanced Editing**: More subtitle styling options
4. **Video Export**: FFmpeg integration for burning subtitles

### Medium Priority

1. **User Authentication**: Login/signup system
2. **Project Management**: Save/load multiple projects
3. **Collaboration**: Share projects with others
4. **Batch Processing**: Handle multiple videos

### Low Priority

1. **Analytics**: Usage tracking and insights
2. **Premium Features**: Advanced AI models, more export formats
3. **Social Features**: Share subtitled videos
4. **Offline Mode**: Work without internet connection

## 🐛 Known Issues

- Video metadata detection is simplified (uses default values)
- AI subtitle generation is currently mocked
- No persistent storage yet (data lost on app restart)
- Limited error handling for edge cases

## 📊 Project Progress

| Component         | Progress | Status              |
| ----------------- | -------- | ------------------- |
| Core Architecture | 100%     | ✅ Complete         |
| UI/UX Design      | 90%      | ✅ Nearly Complete  |
| Video Upload      | 100%     | ✅ Complete         |
| Video Player      | 80%      | 🚧 Good Progress    |
| Subtitle Editor   | 85%      | 🚧 Good Progress    |
| AI Integration    | 20%      | 🚧 Placeholder Only |
| Export Features   | 70%      | 🚧 Good Progress    |
| Storage System    | 10%      | ❌ Not Started      |
| Testing           | 30%      | 🚧 Basic Testing    |

**Overall Progress: ~40%**

## 🤝 Contributing

This is a college project, but suggestions and feedback are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is for educational purposes only.

## 👤 Author

**Vinayak Singh**

- College Project - Mobile Application Development
- Contact: [Your Email/Contact Info]

---

_Last Updated: October 2025_
