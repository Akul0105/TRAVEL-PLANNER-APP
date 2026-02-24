# Travel Planner System - Flowcharts

## 1. Complete System Architecture

```mermaid
flowchart TD
    START([User Opens Website]) --> NAV[Global Navigation Bar]
    
    NAV --> |Click Home| HOME[Home Page /]
    NAV --> |Click Analytics| ANALYTICS[Analytics Page /analytics]
    
    %% Home Page Components
    HOME --> HERO[HeroSection<br/>Video Background + Animated Text]
    HOME --> SEARCH[SearchBar<br/>useSearch Hook]
    HOME --> POPULAR[Popular Destinations<br/>6 Cards with AnimatedCard]
    HOME --> FORM[UserDetailsForm<br/>User preferences]
    HOME --> CHAT[ChatbotWrapper<br/>Connects Icon + Chatbot]
    
    %% Search Flow
    SEARCH --> |User Types| USEARCH[useSearch Hook<br/>Manages: query, suggestions, marketBasketResults]
    USEARCH --> |Show Results| SUGGEST[MBA Recommendations<br/>People Also Booked]
    
    %% Chatbot Flow
    CHAT --> |Contains| CHATICON[FloatingChatIcon<br/>Bottom-right button]
    CHAT --> |Contains| CHATUI[Chatbot UI<br/>ReactMarkdown rendering]
    
    CHATICON --> |Click Toggle| USECHAT[useChatbot Hook<br/>State: isOpen, messages, isLoading]
    CHATUI --> |Send Message| USECHAT
    
    USECHAT --> |Call| MYSTRAL[mystralService.ts<br/>buildConversationContext<br/>Dynamic System Prompt]
    MYSTRAL --> |API Call| APIROUTE[/api/chat Route<br/>Next.js API Handler]
    APIROUTE --> |External| MYSTRALAI[(Mystral AI<br/>mistral-large-latest)]
    MYSTRALAI --> |Response| APIROUTE --> |Return| MYSTRAL --> |Display| CHATUI
    
    %% MBA Engine
    USEARCH --> |Triggers| MBAENGINE[src/lib/mba/engine.ts<br/>MBA Core Logic]
    MBAENGINE --> |Generates| ASSOC[Association Rules<br/>Support, Confidence, Lift]
    MBAENGINE --> |Generates| SEQUENTIAL[Sequential Patterns<br/>What's next after X]
    MBAENGINE --> |Generates| SEASONAL[Seasonal Rules<br/>Patterns by month/season]
    MBAENGINE --> |Generates| GEO[Geo-Aware Rules<br/>Origin-based patterns]
    MBAENGINE --> |Generates| SEGMENTS[Customer Segments<br/>Group by travel type]
    
    %% MBA Display Components
    ASSOC --> |Shows| RECS[MBARecommendations<br/>People Also Booked]
    ASSOC --> |Shows| BUNDLES[MBABundleGenerator<br/>Package Creator]
    SEQUENTIAL --> |Shows| SEQCOMP[MBASequentialAnalysis<br/>Next Best Action]
    
    HOME --> |Shows| RECS
    ANALYTICS --> |Shows| DASH[Analytics Dashboard<br/>TopRules, Seasonal, Segments]
    
    SEGMENTS --> |Displays| DASH
    SEASONAL --> |Displays| DASH
    
    %% UI Components
    HERO --> |Uses| ANIMTEXT[AnimatedGradientText<br/>gradient-text.tsx]
    POPULAR --> |Uses| ANIMCARD[AnimatedCard<br/>animated-card.tsx]
    POPULAR --> |Uses| MAGICBTN[MagicButton<br/>magic-button.tsx]
    SEARCH --> |Uses| FADEIN[FadeInText<br/>text-animations.tsx]
```

## 2. Chatbot Conversation Flow

```mermaid
sequenceDiagram
    participant User
    participant FloatingIcon as FloatingChatIcon
    participant ChatbotHook as useChatbot Hook
    participant ChatUI as Chatbot UI
    participant MystralSvc as mystralService
    participant API as /api/chat
    participant MystralAI as Mystral AI
    
    User->>FloatingIcon: Click to open chatbot
    FloatingIcon->>ChatbotHook: toggleChatbot()
    ChatbotHook->>ChatUI: Set isOpen = true
    ChatUI->>User: Display welcome message
    
    User->>ChatUI: Type message: "I want to go to Paris"
    ChatUI->>ChatbotHook: sendMessage("I want to go to Paris")
    ChatbotHook->>ChatbotHook: Create user message object
    ChatbotHook->>MystralSvc: sendChatMessage(messages[])
    
    MystralSvc->>MystralSvc: buildConversationContext()
    Note over MystralSvc: Extract:<br/>- User preferences<br/>- Mentioned destinations<br/>- Build dynamic prompt
    
    MystralSvc->>API: POST /api/chat<br/>{messages, system prompt}
    API->>MystralAI: Forward request to Mystral API
    
    MystralAI-->>API: Response with AI content
    API-->>MystralSvc: Return assistant message
    MystralSvc-->>ChatbotHook: Return message content
    
    ChatbotHook->>ChatbotHook: Create assistant message
    ChatbotHook->>ChatUI: Update messages state
    ChatUI->>ChatUI: Render via ReactMarkdown
    ChatUI->>User: Display: "Nice! Paris is amazing. 🗼<br/>What's your budget? I can also<br/>suggest amazing restaurants!"
    
    Note over ChatUI,User: Short, conversational response<br/>with MBA suggestions
```

## 3. Market Basket Analysis Pipeline

```mermaid
flowchart LR
    %% Data Input
    TXN[Transaction Data<br/>Mock Travel Bookings] --> PROCESS
    SEQS[User Sequences<br/>Search → Flight → Hotel] --> PROCESS
    SEASON[Time Data<br/>Month/Season] --> PROCESS
    GEO_DATA[Geographic Data<br/>Origin/Destination] --> PROCESS
    PROFILES[Customer Profiles<br/>Type, Preferences] --> PROCESS
    
    %% Processing
    PROCESS[MBA Engine<br/>src/lib/mba/engine.ts] --> ASSOC_RULES[Association Rules<br/>Support, Confidence, Lift]
    PROCESS --> SEQ_RULES[Sequential Rules<br/>PrefixSpan, SPADE]
    PROCESS --> SEASON_RULES[Seasonal Rules<br/>Patterns by month]
    PROCESS --> GEO_RULES[Geo-Aware Rules<br/>Origin-based patterns]
    PROCESS --> CUST_SEG[Customer Segmentation<br/>Group by travel type]
    
    %% Output Components
    ASSOC_RULES --> RECS_COMP[MBARecommendations<br/>People Also Booked]
    SEASON_RULES --> SEASON_DASH[SeasonalInsights<br/>Analytics Dashboard]
    GEO_RULES --> GEO_DASH[Geographic Insights<br/>Analytics Dashboard]
    CUST_SEG --> SEG_DASH[CustomerSegmentAnalysis<br/>Analytics Dashboard]
    
    %% Display
    RECS_COMP --> UI_SHOW[UI Display<br/>Home Page - Search]
    SEASON_DASH --> UI_SHOW4[UI Display<br/>Analytics Page]
    GEO_DASH --> UI_SHOW4
    SEG_DASH --> UI_SHOW4
```

## 4. User Journey Flow

```mermaid
flowchart TD
    START([User Lands on Website]) --> HOME[Home Page]
    
    HOME --> |Scrolls| VIDEO[Sees Video Background<br/>WhatsApp Video 2025-10-16]
    HOME --> |Scrolls| DEST_CARDS[Sees Popular Destinations<br/>Mauritius, London, Paris, etc.]
    HOME --> |Fills preferences| FORM[UserDetailsForm]
    
    HOME --> |Clicks Chat Button| CHAT_OPEN[Chatbot Opens]
    CHAT_OPEN --> CHAT_CONV[Conversation with AI<br/>Short, natural responses]
    CHAT_CONV --> |AI Suggests| MBA_TIPS[MBA Recommendations<br/>People Also Booked]
    
    HOME --> |Clicks Navigation| NAV[Choose Page]
    
    NAV --> |Analytics| ANALYTICS_PAGE[Analytics Dashboard]
    ANALYTICS_PAGE --> TOP_RULES[Top Association Rules<br/>Correlated items]
    ANALYTICS_PAGE --> SEASONAL_VIEW[Seasonal Insights<br/>Patterns by month]
    ANALYTICS_PAGE --> SEGMENTS_VIEW[Customer Segments<br/>Travel types]
    
    MBA_TIPS --> USER_DECISION{User Decision}
    
    USER_DECISION --> |Explores More| NAV
    USER_DECISION --> |Chats with AI| CHAT_CONV
    USER_DECISION --> |Fills Form| FORM
```

## 5. Technical Stack & Data Flow

```mermaid
flowchart TB
    subgraph FRONTEND[Frontend - Next.js 15]
        PAGES[Pages<br/>/, /analytics, /details]
        COMPONENTS[Components<br/>HeroSection, Chatbot, SearchBar, etc.]
        HOOKS[Custom Hooks<br/>useChatbot, useSearch]
        UI_KIT[UI Components<br/>AnimatedCard, MagicButton, etc.]
    end
    
    subgraph API_LAYER[API Layer]
        ROUTE[/api/chat<br/>Route Handler]
    end
    
    subgraph SERVICES[Service Layer]
        MYSTRAL_SVC[mystralService.ts<br/>buildConversationContext<br/>sendChatMessage]
        MBA_ENGINE[mba/engine.ts<br/>Association Rules<br/>Sequential Mining<br/>Seasonal Analysis]
    end
    
    subgraph EXTERNAL[External Services]
        MYSTRAL_API[(Mystral AI API<br/>mistral-large-latest)]
    end
    
    PAGES --> COMPONENTS
    COMPONENTS --> HOOKS
    HOOKS --> SERVICES
    SERVICES --> ROUTE
    ROUTE --> MYSTRAL_API
    MYSTRAL_API --> ROUTE
    ROUTE --> SERVICES
    SERVICES --> COMPONENTS
    COMPONENTS --> UI_KIT
    
    HOOKS --> MBA_ENGINE
    MBA_ENGINE --> COMPONENTS
```

## How to View These Flowcharts

1. **GitHub**: Create a pull request or push this file - GitHub renders Mermaid automatically
2. **VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Copy code blocks to https://mermaid.live
4. **Documentation**: Include in your project's documentation

## Key Takeaways

- **Modular Architecture**: Clear separation between pages, components, hooks, and services
- **AI Integration**: Mystral AI powers conversational recommendations
- **MBA Engine**: Provides data-driven insights and suggestions
- **User Experience**: Smooth animations, conversational AI, and intelligent recommendations
- **Scalable Design**: Easy to add new features and extend functionality

