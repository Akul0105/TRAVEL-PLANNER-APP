# Travel Agent Planner - AI-Powered Travel Planning

A modern, aesthetic travel planning website featuring an AI-powered chatbot and intelligent search functionality. This prototype demonstrates market basket analysis simulation using Mystral AI for travel recommendations.

## 🚀 Features

### 🤖 AI-Powered Chatbot
- **Mystral AI Integration**: Powered by Mystral AI API for intelligent travel conversations
- **Travel Agent Context**: Configured specifically for travel-related discussions
- **Market Basket Analysis**: Simulates complementary product recommendations
- **Real-time Chat**: Smooth, responsive chat interface with typing indicators

### 🔍 Smart Search
- **Google-like Suggestions**: Intelligent autocomplete with travel-specific suggestions
- **Real-time Results**: Debounced search with instant suggestions
- **Category-based Results**: Destinations, hotels, flights, packages, and activities
- **Popular Searches**: Quick access to trending travel destinations

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for all device sizes
- **Smooth Animations**: Framer Motion powered transitions
- **Aesthetic Design**: Modern gradient backgrounds and glass-morphism effects
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: Mystral AI API
- **State Management**: Custom React Hooks

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── Chatbot.tsx        # Chat interface component
│   ├── FloatingChatIcon.tsx # Floating chat button
│   ├── HeroSection.tsx    # Main hero section
│   └── SearchBar.tsx      # Search input with suggestions
├── hooks/                 # Custom React hooks
│   ├── useChatbot.ts      # Chatbot state management
│   └── useSearch.ts       # Search functionality
├── lib/                   # Utility functions
│   └── utils.ts           # Helper functions and utilities
├── services/              # API services
│   └── mystralService.ts  # Mystral AI integration
└── types/                 # TypeScript type definitions
    └── index.ts           # All type interfaces
```

## 🔧 Setup and Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-agent-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   The Mystral AI API key is already configured in the service file:
   ```typescript
   // src/services/mystralService.ts
   const MYSTRAL_API_KEY = 'aKRU8CQiTLFfPeKHam4WAEPteYRZ7mkG';
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Key Components

### Chatbot Component
- **Location**: `src/components/Chatbot.tsx`
- **Features**: Message history, typing indicators, error handling
- **API Integration**: Connects to Mystral AI for travel-specific responses

### Search Bar Component
- **Location**: `src/components/SearchBar.tsx`
- **Features**: Autocomplete, category icons, popular searches
- **Debouncing**: Prevents excessive API calls while typing

### Hero Section
- **Location**: `src/components/HeroSection.tsx`
- **Features**: Animated backgrounds, feature highlights, statistics
- **Responsive**: Adapts to different screen sizes

## 🔌 API Integration

### Mystral AI Service
The application integrates with Mystral AI API for intelligent travel conversations:

```typescript
// System prompt ensures travel agent context
const TRAVEL_AGENT_SYSTEM_PROMPT = `You are a professional travel agent assistant...`;

// API call with travel-specific configuration
const response = await fetch(MYSTRAL_API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${MYSTRAL_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'mistral-large-latest',
    messages: apiMessages,
    max_tokens: 1000,
    temperature: 0.7,
  }),
});
```

## 📊 Market Basket Analysis Simulation

The application simulates market basket analysis by:

1. **Contextual Recommendations**: AI suggests related travel products based on user interests
2. **Complementary Services**: Recommends hotels, activities, and services that pair well
3. **Personalization**: Adapts suggestions based on conversation history
4. **Travel Categories**: Organizes recommendations by type (destinations, hotels, flights, etc.)

## 🎨 Customization Guide

### Changing Colors and Themes
Update the Tailwind CSS classes in components:
```typescript
// Example: Change primary color from blue to green
className="bg-blue-500" → className="bg-green-500"
```

### Adding New Search Categories
1. Update the `SearchSuggestion` type in `src/types/index.ts`
2. Add new category logic in `src/hooks/useSearch.ts`
3. Update the icon mapping in `src/components/SearchBar.tsx`

### Modifying Chatbot Behavior
1. Edit the system prompt in `src/services/mystralService.ts`
2. Adjust API parameters (temperature, max_tokens, etc.)
3. Update the welcome message in `src/hooks/useChatbot.ts`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
The application is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Any platform supporting Node.js

## 📝 Development Notes

### Code Organization
- **Modular Structure**: Each component has a single responsibility
- **Type Safety**: Full TypeScript coverage with proper interfaces
- **Comments**: Comprehensive documentation for maintainability
- **Error Handling**: Graceful fallbacks for API failures

### Performance Optimizations
- **Debounced Search**: Prevents excessive API calls
- **Lazy Loading**: Components load only when needed
- **Optimized Animations**: Smooth 60fps animations with Framer Motion
- **Responsive Images**: Optimized for different screen sizes

## 🔮 Future Enhancements

- **Real-time Chat**: WebSocket integration for instant messaging
- **User Authentication**: Login system for personalized experiences
- **Booking Integration**: Connect to actual travel booking APIs
- **Advanced Analytics**: Detailed user behavior tracking
- **Multi-language Support**: Internationalization for global users

## 📞 Support

For questions or issues with this prototype:
1. Check the component documentation in the code
2. Review the TypeScript interfaces for expected data structures
3. Verify API key configuration in the service file
4. Ensure all dependencies are properly installed

## 📄 License

This project is a prototype demonstration for educational and presentation purposes.

---

**Built with ❤️ for travel planning innovation**