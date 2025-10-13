# Portuguese Language Drills

An interactive Portuguese language learning platform with AI-powered drill sessions and integrated chat functionality. Practice multiple drills simultaneously with smart drill rotation and comprehensive error handling.

Designed to be dialect-neutral (PT-PT and PT-BR) with enhanced learning experiences powered by Claude AI.

- **Live Site**: Deployed on Cloudflare Pages
- **Tech Stack**: HTML + Tailwind CSS + Cloudflare Pages Functions + Anthropic Claude API
- **No Build Step**: Pure HTML with CDN-based styling

## Key Features

### 🎯 Multi-Drill Sessions
- **Start Empty Session**: Begin with no drills and add only what you want to practice
- **Add Multiple Drills**: Combine multiple drills in a single chat session
- **Random Drill Rotation**: Questions alternate randomly between active drills
- **Remove Drills Anytime**: Click X on any drill badge to remove it from the session
- **Dynamic Drill Display**: Chat header shows all active drills in real-time

### 💬 Integrated AI Chat
- **Powered by Claude**: Uses Anthropic's Claude Sonnet 4.5 model
- **Contextual Practice**: AI tutor maintains conversation context across drills
- **Session Persistence**: Sessions are preserved for each drill type
- **Split Button Interface**: Choose between ChatGPT version or integrated chat

### 🔧 Smart Error Handling
- **Mobile-Optimized**: 90-second timeout for slower mobile connections
- **Intelligent Retry**: One-click retry button when errors occur
- **Detailed Error Messages**: Specific messages for timeouts, network issues, and server errors
- **No Auto-Focus**: Input field doesn't auto-focus on mobile (prevents keyboard obstruction)

### 🎨 User Interface
- **Active Drills Badges**: Visual display of all active drills with remove buttons
- **Empty State Handling**: Clear instructions when no drills are active
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean Header**: "No drills active" / Single drill name / Multiple drills separated by bullets

### 📚 Extensive Drill Library
- **40+ Drills Available**: Covering A1 to B2+ levels
- **Filterable by Topic**: Verbs, Grammar, Tenses, Pronunciation, Conversation
- **Search Functionality**: Find specific drills by keyword
- **Learning Paths**: Structured progression from A1 to B2

## Recent Updates (Last 2 Weeks)

### New Drills Added
- ✅ **Portuguese for Spanish Speakers** - Leverage Spanish knowledge with false friends, vocabulary gaps, and grammar differences
- ✅ **Self-Introduction Drill** - Build first Portuguese sentences for beginners
- ✅ **Conversational Answers Drill** - Master answering yes/no questions by repeating verbs
- ✅ **Colloquial Speech Drill** - Learn real spoken Brazilian Portuguese (você→cê, estar→tá)
- ✅ **Brazilian Portuguese Phonetics Tutor** - Master written-to-spoken transformations
- ✅ **Syllable Stress Drill** - Perfect Portuguese pronunciation patterns

### Chat System Improvements
- ✅ Multi-drill session support with random alternation
- ✅ Start empty session functionality
- ✅ Add/remove drills dynamically during session
- ✅ Retry functionality for failed requests
- ✅ Mobile-optimized timeout and error handling
- ✅ Removed auto-focus to prevent keyboard popup on mobile

### UI/UX Enhancements
- ✅ Dynamic chat header showing all active drills
- ✅ Active drills badge section with remove buttons
- ✅ Empty state messaging and guidance
- ✅ Updated site branding to "Portuguese Language Drills"
- ✅ Simplified subtitle focusing on core functionality

## Usage

### Starting a Session

**Option 1: Start Empty**
1. Click "Start Empty Session" button
2. Click "+ Add Drill" in the chat header
3. Select drills you want to practice
4. Begin practicing with custom drill combination

**Option 2: Start from Drill Card**
1. Click "🚀 Try Integrated" on any drill card
2. Chat opens with that drill active
3. Optionally add more drills with "+ Add Drill"
4. Practice single drill or multiple drills together

### Managing Drills
- **Add Drill**: Click "+ Add Drill" button → Select from available drills
- **Remove Drill**: Click X on any drill badge
- **New Session**: Click "New Session" to start fresh
- **View Active Drills**: Check the header or badge section

### Handling Errors
- If an error occurs, a red error box will appear
- Click "Retry Message" to resend your last message
- Check error message for specific issue (timeout, network, server)

## Development

### Local Development
```bash
# No build step required - just open index.html
open index.html

# For API functionality, use Wrangler
npx wrangler pages dev .
```

### Environment Variables
Set in Cloudflare Pages → Settings → Environment Variables:
- `ANTHROPIC_API_KEY` - Your Anthropic API key for Claude

### Project Structure
```
├── index.html              # Main application file
├── config/
│   └── prompts/           # Drill prompt configurations (JSON)
├── utils/
│   └── promptManager.js   # Prompt loading and management
└── functions/
    └── api/
        └── chat.ts        # Cloudflare Pages Function for chat API
```

### API Endpoint
**POST** `/api/chat`

Request body:
```json
{
  "sessionId": "optional-session-id",
  "drillId": "drill-identifier",
  "message": "user message",
  "isNewSession": true
}
```

Response:
```json
{
  "sessionId": "session-identifier",
  "response": "AI response text"
}
```

## Deployment

Deployed automatically via Cloudflare Pages:
- **Production**: Deploys from `master` branch
- **Preview**: Automatic preview for all branches
- **Functions**: Cloudflare Workers handle API requests

## Contributing

Contributions welcome! Please:
1. Open an issue for discussion on larger changes
2. Keep PRs focused on a single feature or fix
3. Test on both desktop and mobile devices
4. Update README for significant feature additions

## Dialects

Drills default to Brazilian Portuguese (BP). Many drills support European Portuguese (EP) - simply ask the AI tutor to switch: "Please switch to European Portuguese" or "Vamos praticar em EP".

## License

This project builds on the original Portuguese Drills by kleinster2.

## Credits

- **AI Model**: Anthropic Claude Sonnet 4.5
- **Hosting**: Cloudflare Pages
- **Styling**: Tailwind CSS
- **Base Project**: [Portuguese Drills](https://kleinster2.github.io/portuguese-drills/)
