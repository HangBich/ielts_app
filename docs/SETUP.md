# ⚡ Quick Setup Guide

## 1️⃣ Get Claude API Key

```
https://console.anthropic.com → API Keys → Create Key
Copy: sk-ant-...
```

## 2️⃣ Install & Run

```bash
# Install Expo if not already
npm install -g expo-cli

# Navigate to project
cd ielts-app

# Install dependencies
npm install

# Start development server
npm start

# Run on device:
# - iOS Simulator: Press 'i'
# - Android Emulator: Press 'a'  
# - Expo Go App: Scan QR code with phone camera
```

## 3️⃣ First Run

- Paste API key in setup screen
- Enter any IELTS essay topic
- Tap "Start Writing"
- Follow the guided flow

## 🎯 Main Flow

```
Setup Screen
    ↓
Essay Screen (Body 1)
    ├→ Main Idea (AI generated)
    │  ├→ Show sentence
    │  ├→ Analyze structure (X-bar)
    │  └→ Record/playback
    │
    ├→ Support Idea 1
    │  ├→ Write rough idea
    │  ├→ AI upgrades to Band 8.5
    │  ├→ Show glossary
    │  └→ Record/playback
    │
    ├→ Support Idea 2 (optional)
    └→ Export Essay
```

## 📱 Development Tips

### Fast Reload
- Save file → Hot reload in Expo automatically
- Or press 'r' in terminal to manual reload

### Debug Network Issues
- Claude API must be reachable
- Check: Your API key is valid at console.anthropic.com
- Check: Internet connection is stable

### Test Without Real API Key
- Remove API key validation temporarily in `App.tsx`
- Use mock Claude responses (not recommended)

## 🔌 Adding Features

### Add New Screen
1. Create file in `screens/YourScreen.tsx`
2. Import in `App.tsx`
3. Add navigation logic

### Modify Claude Prompts
- All prompts are in `services/claudeAPI.ts`
- Each method has clear comments
- Modify text in the `prompt` variable

### Customize UI
- Colors defined in `components/UIComponents.tsx` → `colors` object
- Reuse components: `RecordButton`, `Button`, `Card`, `TextInput`

## ❌ Common Issues

| Issue | Solution |
|-------|----------|
| API Key rejected | Verify key format `sk-ant-...` at console.anthropic.com |
| Microphone not working | Grant app permission (iOS: Settings → Privacy → Microphone) |
| App crashes on startup | Run `npm install` again, restart Expo |
| Claude API timeout | Check internet, try again |

## 📊 File Sizes

```
services/claudeAPI.ts      ~7 KB (Claude API logic)
screens/EssayScreen.tsx    ~12 KB (Main UI flow)
components/UIComponents.tsx ~8 KB (Reusable UI)
hooks/useRecording.ts      ~5 KB (Voice logic)
App.tsx                    ~6 KB (Setup & nav)
```

**Total**: ~38 KB TypeScript code (very lightweight!)

---

Happy coding! 🚀
