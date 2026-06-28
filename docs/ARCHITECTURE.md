# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Native (Expo)                   │
├──────────────────┬──────────────────┬────────────────────┤
│  App.tsx         │ screens/         │ components/        │
│  (Setup/Nav)     │ EssayScreen.tsx  │ UIComponents.tsx   │
│                  │ (Main Flow)      │ (UI Elements)      │
├──────────────────┴──────────────────┴────────────────────┤
│                      State Management                     │
│  - Topic, API Key                                         │
│  - Main Idea, Support Ideas                              │
│  - Recording URIs, Analysis results                      │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐    ┌───▼────┐    ┌───▼────┐
   │ Services│    │ Hooks  │    │ Assets │
   │         │    │        │    │        │
   │ Claude  │    │ useRec │    │Fonts..│
   │ API     │    │ording  │    │        │
   └────┬────┘    └────────┘    └────────┘
        │
        └─────────────────┬──────────────────┐
                          │                  │
                   ┌──────▼──────┐    ┌────▼─────┐
                   │   HTTP      │    │ expo-av  │
                   │   (Axios)   │    │ (Audio)  │
                   └──────┬──────┘    └────┬─────┘
                          │                 │
              ┌───────────▼─────────┐  ┌───▼──────────┐
              │ Claude API          │  │ Device Mic   │
              │ (AI Analysis)       │  │ & Storage    │
              └─────────────────────┘  └──────────────┘
```

---

## Data Flow: Complete Essay Creation

```
USER INPUT (Topic)
    │
    ▼
┌─────────────────────────────────────────┐
│ RHYTHM 1: MAIN IDEA                     │
├─────────────────────────────────────────┤
│ 1. generateMainIdea(topic)              │
│    → Claude API generates Band 8.5 idea │
│ 2. Display in styled card               │
│ 3. Record button (shadowing)            │
│ 4. analyzeMainIdea(sentence)            │
│    → Claude explains X-bar structure    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ RHYTHM 2: SUPPORT IDEA (Repeatable)     │
├─────────────────────────────────────────┤
│ 1. User writes rough idea (Band 5.5)    │
│ 2. upgradeToB85()                       │
│    → Claude analyzes semantic clashes   │
│    → Returns upgraded sentence          │
│    → Extracts academic glossary         │
│ 3. Display upgraded sentence + glossary │
│ 4. Record button (shadowing)            │
│ 5. Option: Add another support idea     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ EXPORT: FINAL ESSAY                     │
├─────────────────────────────────────────┤
│ 1. Collect all ideas (main + supports)  │
│ 2. exportEssay()                        │
│    → Claude synthesizes into full essay │
│    → 250-300 words, Band 8.5+           │
│ 3. Display complete essay                │
│ 4. User can copy/save                   │
└─────────────────────────────────────────┘

FINAL OUTPUT: Band 8.5+ Essay
```

---

## Component Hierarchy

```
App (Root)
├── SetupScreen (StateManagement)
│   ├── TextInput (API Key)
│   ├── TextInput (Topic)
│   └── Button (Start)
│
└── EssayScreen (Main Flow)
    ├── SectionHeader (Body 1 - Main Idea)
    ├── Card
    │   ├── MainIdeaSentence (Display)
    │   ├── RecordButton (Voice)
    │   ├── PlaybackButton (Voice)
    │   ├── AnalysisBox (X-bar + Semantics)
    │   └── Button (Analyze)
    │
    ├── SectionHeader (Support Ideas)
    ├── Card (Current Support Being Edited)
    │   ├── TextInput (Rough Idea)
    │   ├── Button (Upgrade)
    │   ├── UpgradedSentence (Display)
    │   ├── GlossaryTags (Academic Terms)
    │   ├── RecordButton (Voice)
    │   ├── PlaybackButton (Voice)
    │   ├── Button (Next Support)
    │   └── Button (Export)
    │
    └── Card[] (Completed Support Ideas List)
```

---

## State Management Structure

```typescript
// Main State (EssayScreen.tsx)
const [step, setState] = useState<'main-idea' | 'main-analysis' | 'support-input' | 'support-upgraded'>()
const [mainIdea, setMainIdea] = useState<string>()
const [mainAnalysis, setMainAnalysis] = useState<string>()
const [supportIdeas, setSupportIdeas] = useState<SupportIdea[]>([
  {
    id: string
    rough: string                // User's Band 5.5 idea
    upgraded?: string            // AI Band 8.5 version
    glossary?: string[]          // Academic vocabulary
    recordingUri?: string        // Voice recording
    status: 'draft' | 'analyzing' | 'upgraded'
  }
])

// Voice State (useRecording hook)
const {
  isRecording: boolean          // Currently recording?
  duration: number              // Recording duration (seconds)
  uri: string | null            // Audio file path
  isPlaying: boolean            // Currently playing?
  error: string | null          // Error message
  startRecording()
  stopRecording()
  playRecording()
  stopPlayback()
  deleteRecording()
}
```

---

## API Integration Pattern

### Claude API Call Example

```typescript
// Method 1: Generate Main Idea
const prompt = `Generate main idea for: "${topic}"`
const response = await this.client.post<ClaudeResponse>('', {
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 150,
  messages: [{ role: 'user', content: prompt }]
})
return response.data.content[0].text.trim()

// Error handling
try {
  // API call
} catch (err) {
  Alert.alert('Error', 'Claude API failed')
  // Graceful fallback
}
```

### Request/Response Flow

```
┌─────────────────────────────────────────┐
│ App (Client)                            │
└────────────────┬────────────────────────┘
                 │
                 │ HTTP POST
                 │ https://api.anthropic.com/v1/messages
                 │ {
                 │   model: 'claude-3-5-sonnet',
                 │   max_tokens: 150,
                 │   messages: [...],
                 │   headers: {'x-api-key': ...}
                 │ }
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Claude API                              │
│ ┌─────────────────────────────────────┐ │
│ │ Process prompt                      │ │
│ │ Generate response                   │ │
│ │ Stream tokens                       │ │
│ └─────────────────────────────────────┘ │
└────────────────┬────────────────────────┘
                 │
                 │ HTTP 200
                 │ {
                 │   content: [{
                 │     type: 'text',
                 │     text: 'Band 8.5 response'
                 │   }],
                 │   usage: {...}
                 │ }
                 │
                 ▼
┌─────────────────────────────────────────┐
│ App (Client) - Handle Response          │
│ - Parse text                            │
│ - Update UI                             │
│ - Enable next step                      │
└─────────────────────────────────────────┘
```

---

## Voice Recording Flow

```
┌──────────────────────┐
│ RecordButton Pressed │
└──────────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ startRecording() │
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │ Audio.Recording.prepareAsync()   │
    │ (Request microphone permission)  │
    └──────┬───────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │ recording.startAsync()           │
    │ Track duration every 100ms       │
    └──────┬───────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │ User is recording...             │
    │ (Stop button becomes active)     │
    └──────┬───────────────────────────┘
           │
     (user taps Stop)
           │
           ▼
    ┌──────────────────────────────────┐
    │ stopRecording()                  │
    │ → Save to device storage         │
    │ → Get URI path                   │
    └──────┬───────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │ Playback button now enabled      │
    │ User can press to listen         │
    └──────────────────────────────────┘
```

---

## Scaling Considerations

### Current MVP (Body 1)
- Single essay topic
- One main idea
- Multiple support ideas
- ~50KB code

### Scale to Full Essay
- Add Body 2 (contrasting idea)
- Add Introduction screen
- Add Conclusion screen
- Add Transition analysis between paragraphs
- Total: ~80-100KB code

### Scale to Production
- User authentication (Supabase/Firebase)
- Persistent storage (Save essays to cloud)
- Analytics (Track user progress)
- Premium features (Extended API limits)
- Caching (Store common topics/ideas)
- Would need: Backend + Database

---

## Performance Metrics

| Task | Time | Notes |
|------|------|-------|
| Load setup screen | <500ms | Local UI only |
| Generate main idea | 2-4s | Claude API call |
| Analyze sentence | 2-3s | Claude API call |
| Upgrade support idea | 3-5s | Claude API call |
| Export essay | 4-6s | Claude API call |
| Record audio | Real-time | Depends on device |
| Playback audio | Real-time | No latency |

---

## Error Handling Strategy

```
┌─────────────────────────────┐
│ User Action                 │
└────────────┬────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ API/Device Call     │
    └────────┬────────────┘
             │
        ┌────┴────┐
        │          │
        ▼          ▼
    Success     Error
        │          │
        │          ▼
        │    ┌─────────────────────┐
        │    │ Catch & Log         │
        │    │ - Error type        │
        │    │ - User message      │
        │    │ - Retry option      │
        │    └────────┬────────────┘
        │             │
        │             ▼
        │    ┌─────────────────────┐
        │    │ Display Alert       │
        │    │ - Friendly message  │
        │    │ - Retry button      │
        │    └────────┬────────────┘
        │             │
        └─────┬───────┘
              │
              ▼
    ┌─────────────────────┐
    │ Update UI State     │
    │ Show error or data  │
    └─────────────────────┘
```

---

## File I/O (Audio Storage)

```
Device Storage
├── /data/user/0/.../app/files/ (expo-file-system)
│   ├── Recording_1704067200000.m4a
│   ├── Recording_1704067260000.m4a
│   └── Recording_1704067320000.m4a
│
└── Session Data (In-Memory)
    ├── mainIdea (string)
    ├── supportIdeas[] (array)
    └── recordingURIs (string[])
```

Each time app restarts, audio files are preserved but session state is cleared.

---

## Security Considerations

⚠️ **API Key Handling**:
```
✗ NEVER hardcode API keys
✓ Always ask user to enter at runtime
✓ Store securely in device secure storage (future: expo-secure-store)
✓ Never log API key to console
```

⚠️ **Data Privacy**:
```
✓ Audio files stored locally only
✓ Essay text never sent to servers (only to Claude API)
✓ Claude processes data per their privacy policy
✓ No user tracking/analytics in MVP
```

---

That's the architecture! All code is lightweight, modular, and ready to scale. 🚀
