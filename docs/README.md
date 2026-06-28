# 📚 IELTS Writing Coach - React Native App

A sophisticated IELTS Writing Task 2 coaching app that guides you through essay creation using Claude AI, with linguistic analysis (X-bar theory), voice recording, and progressive idea refinement.

## 🎯 Features

### **Body 1 Flow (MVP)**
1. **Rhythm 1 - Main Idea Generation**
   - AI generates Band 8.5+ thesis statement from essay topic
   - X-bar structure + semantic analysis of the sentence
   - Record & playback main idea (shadowing technique)

2. **Rhythm 2 - Support Idea Refinement** (Repeatable)
   - Write your rough support idea (Band 5.5-6.0)
   - AI analyzes semantic clashes and grammar issues
   - Automatic upgrade to Band 8.5+ with academic vocabulary
   - Glossary of key academic terms suggested
   - Record & playback upgraded sentence
   - Add multiple support ideas

3. **Export**
   - Combine all ideas into complete Band 8.5+ essay
   - Ready for submission

### **Key Technologies**
- **Frontend**: React Native + Expo
- **AI**: Claude API (3.5 Sonnet)
- **Voice**: expo-av for recording/playback
- **Language**: TypeScript

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- Claude API key from [console.anthropic.com](https://console.anthropic.com)

### Installation

```bash
# Clone or setup the project
cd ielts-app

# Install dependencies
npm install

# Start the Expo server
npm start

# Run on your device/simulator
# iOS: Press 'i'
# Android: Press 'a'
# Web: Press 'w'
```

### API Key Setup
1. Get your Claude API key at [console.anthropic.com](https://console.anthropic.com)
2. Open the app
3. Paste your API key in the setup screen
4. Enter your IELTS essay topic
5. Start writing!

---

## 📂 Project Structure

```
ielts-app/
├── App.tsx                          # Main entry, setup screen
├── screens/
│   └── EssayScreen.tsx              # Body 1 essay flow
├── components/
│   └── UIComponents.tsx             # Reusable UI elements
├── hooks/
│   └── useRecording.ts              # Voice recording logic
├── services/
│   └── claudeAPI.ts                 # Claude API integration
├── app.json                         # Expo config
├── babel.config.js                  # Babel setup
├── tsconfig.json                    # TypeScript config
└── package.json                     # Dependencies
```

---

## 🎮 How to Use

### Step 1: Setup
- Enter Claude API key
- Paste your IELTS essay topic
- Tap "Start Writing"

### Step 2: Main Idea
1. Review AI-generated Band 8.5+ main idea
2. Tap "Analyze Sentence Structure" to see X-bar + semantic breakdown
3. Record yourself reading the main idea (shadowing)
4. Play back to check pronunciation

### Step 3: Support Ideas (Repeat)
1. Tap "Add Support Idea"
2. Write your rough idea in simple English
3. Tap "Upgrade to Band 8.5" - AI refines it
4. Review academic vocabulary suggestions
5. Record the upgraded sentence
6. Tap "Add Next Support Idea" or "Export Essay"

### Step 4: Export
- Tap "Export Essay"
- Get your complete Band 8.5+ essay

---

## 🔧 Configuration

### Change AI Model
Edit `services/claudeAPI.ts`:
```typescript
private model = 'claude-3-5-sonnet-20241022'; // Change here
```

### Customize Prompts
All Claude prompts are in `services/claudeAPI.ts`. Modify:
- `generateMainIdea()` - Main thesis generation
- `analyzeMainIdea()` - X-bar + semantic analysis
- `upgradeToB85()` - Support idea refinement
- `exportEssay()` - Final essay assembly

---

## 📝 Example Flow

**Topic**: "Technology is destroying human relationships. To what extent do you agree?"

**Main Idea** (Generated):
> "While technological advancement has undoubtedly transformed interpersonal dynamics, attributing the deterioration of human relationships solely to digital innovation obscures the complex interplay between mediation and social agency."

**Your Support Idea** (Rough):
> "Social media makes people more isolated because they spend time online instead of meeting friends"

**Upgraded Support Idea** (AI Enhanced):
> "The proliferation of digital communication platforms, rather than facilitating genuine connection, perpetuates a paradoxical social withdrawal wherein individuals, paradoxically, accumulate extensive virtual networks whilst experiencing diminished face-to-face engagement."

**Glossary**: perpetuates, paradoxical, proliferation, diminished engagement

---

## ⚠️ Troubleshooting

### API Key Issues
- **Error: "Invalid API key"**
  - Verify your key starts with `sk-ant-`
  - Check key hasn't expired at console.anthropic.com
  - Ensure billing is active

### Voice Recording Not Working
- **iOS**: Grant microphone permission when prompted
- **Android**: Ensure audio recording permission is enabled in settings
- **Web**: Not supported (use mobile)

### Network Issues
- Ensure stable internet connection (Claude API calls are network-dependent)
- Check firewall/proxy settings

### Out of Memory on Long Essays
- Export after 3-4 support ideas
- Create multiple exports if needed

---

## 🎓 Linguistic Theory Notes

### X-bar Theory
Structure of noun phrases using hierarchical levels:
```
NP
├── Specifier (the)
└── N'
    ├── Head (N) - "emergence"
    └── Complement (PP) - "of technology"
```
The app helps visualize this in actual Band 8.5 sentences.

### Theta Roles (Semantic Analysis)
- **Causer**: The force causing action (NOT always the subject)
- **Theme**: The entity affected
- **Agent**: Conscious performer (distinct from Causer)

Example: "The **emergence** of AI (Causer) has transformed (Theme) society"
vs. "**Companies** (Agent) developed AI"

---

## 🚀 Future Enhancements (Post-MVP)

- [ ] Body 2 (contrasting argument flow)
- [ ] Introduction + Conclusion templates
- [ ] Speech-to-text support idea input
- [ ] Pronunciation scoring with phoneme analysis
- [ ] Custom essay templates/structures
- [ ] Progress tracking & analytics
- [ ] Offline mode with cached prompts
- [ ] Band 7.0 intermediate mode
- [ ] Export to PDF/Word
- [ ] Peer review & scoring
- [ ] Video tutorials for each rhythm

---

## 📄 License

MIT - Feel free to use and modify

---

## 💬 Support

For issues or feature requests:
1. Check troubleshooting section above
2. Verify Claude API is working at console.anthropic.com
3. Check device microphone permissions

---

**Happy Writing! 🎯**
