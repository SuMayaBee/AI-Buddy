# Interactive Realtime AI Boyfriend

An interactive, realtime web application featuring an AI boyfriend companion with natural voice conversations, built on a modern tech stack including Next.js 15 (App Router), Shadcn/ui, and Tailwind CSS. The application leverages WebRTC for seamless bidirectional audio streaming with OpenAI's Realtime API, enabling low-latency voice interactions. The interactive avatar is powered by HeyGen Streaming Avatar SDK, providing realtime facial animations and lip-sync capabilities. The architecture supports dynamic tool calling with real-time function execution, creating a truly immersive and responsive companion experience.

## Features

- **Real-time Voice Conversations**: Have natural, seamless bidirectional conversations with your AI boyfriend using OpenAI's Realtime API and WebRTC technology
- **Interactive Avatar**: See your AI boyfriend come to life with an animated avatar powered by HeyGen Streaming Avatar SDK that responds and reacts in real-time
- **Personalized Interactions**: Dynamic function execution that allows your AI boyfriend to:
  - Check the current time and timezone for you
  - Adjust the theme (dark/light mode) to match your preferences
  - Create fun moments with party mode and confetti animations
  - Help with tasks like copying to clipboard
  - Launch websites and assist with browsing
- **Modern UI Components**: Beautiful, comprehensive Shadcn/ui component library built on Radix UI foundations for a polished experience
- **Type-Safe**: Full TypeScript support with strict ESLint configuration ensuring reliability
- **Responsive Design**: Mobile-friendly interface with adaptive layouts - chat with your AI boyfriend anywhere, anytime
- **Theme Support**: Built-in light/dark mode switching to match your mood and preferences
- **Code Editor**: Integrated CodeMirror for live code editing and visualization when needed
- **Analytics**: Vercel Analytics integration for usage tracking
- **Token Usage Display**: Real-time monitoring of API token consumption to keep track of usage

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Shadcn/ui
- **Language**: TypeScript
- **Avatar**: HeyGen Streaming Avatar
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks (custom `use-webrtc` hook for WebRTC abstraction)
- **UI Library**: 30+ Radix UI components
- **Code Editor**: CodeMirror with language support
- **Notifications**: Sonner toast notifications
- **Icons**: Phosphor Icons

## Requirements

- **Node.js** 18+ or **Deno**
- **OpenAI API Key** (or Azure OpenAI API Key)
- **HeyGen API Key** and Avatar ID
- Modern browser with WebRTC support

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/cameronking4/shadcn-openai-realtime-webrtc.git
cd shadcn-openai-realtime-webrtc
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key

# HeyGen API Configuration
NEXT_PUBLIC_HEYGEN_API_KEY=your-heygen-api-key
NEXT_PUBLIC_HEYGEN_AVATAR_ID=your-heygen-avatar-id
```

#### Environment Variables Explanation

- **OPENAI_API_KEY**: Your OpenAI API key for accessing the Realtime API. Get it from [OpenAI Platform](https://platform.openai.com/api-keys)
- **NEXT_PUBLIC_HEYGEN_API_KEY**: Your HeyGen API key for avatar streaming. Get it from [HeyGen Dashboard](https://app.heygen.com/dashboard)
- **NEXT_PUBLIC_HEYGEN_AVATAR_ID**: The avatar ID from your HeyGen account to use for your AI boyfriend avatar

### 3. Install Dependencies

If using **Node.js**:

```bash
npm install
```

If using **Deno**:

```bash
deno install
```

### 4. Run the Application

#### Using Node.js:

```bash
npm run dev
```

#### Using Deno:

```bash
deno task start
```

The application will be available at `http://localhost:3000`.

## Usage

1. Open the app in your browser: `http://localhost:3000`.
2. Grant camera and microphone permissions when prompted.
3. Select your preferred voice for your AI boyfriend.
4. Click the call button to start your conversation session.
5. Begin talking naturally - your AI boyfriend will respond in real-time with voice and animated expressions.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for their API and models.
- [Next.js](https://nextjs.org/) for the framework.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Simon Willison's Weblog](https://simonwillison.net/2024/Dec/17/openai-webrtc/) for inspiration
- [Originator: skrivov](https://github.com/skrivov/openai-voice-webrtc-next) for the WebRTC and Nextjs implementation
