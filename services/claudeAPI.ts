// services/claudeAPI.ts
import axios, { AxiosInstance } from 'axios';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ClaudeService {
  private apiKey: string;
  private client: AxiosInstance;
  private apiUrl = 'https://api.anthropic.com/v1/messages';
  private model = 'claude-3-5-sonnet-20241022';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
    });
  }

  /**
   * Sinh ra Main Idea mẫu Band 8.5 từ đề bài
   */
  async generateMainIdea(essayTopic: string): Promise<string> {
    const prompt = `You are an IELTS Writing band 8.5+ examiner. 
    
Generate a sophisticated main idea (thesis statement) for this IELTS Writing Task 2 essay topic:
"${essayTopic}"

Requirements:
- Use complex sentence structures with nominalization (avoid simple relative clauses)
- Band 8.5+ vocabulary (academic, precise)
- 1-2 sentences max
- Direct, argumentative stance
- Use X-bar theory: put nominalized concepts in subject position instead of lengthy subordinate clauses

Output ONLY the main idea sentence(s), nothing else.`;

    const response = await this.client.post<ClaudeResponse>('', {
      model: this.model,
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.data.content[0].text.trim();
  }

  /**
   * Giải phẫu X-bar + ngữ nghĩa của một câu
   */
  async analyzeMainIdea(sentence: string): Promise<string> {
    const prompt = `Analyze this Band 8.5+ IELTS essay sentence using X-bar Theory and semantic analysis:

Sentence: "${sentence}"

Provide:
1. **X-bar Structure**: Identify NP, VP, DP blocks and explain nominalization patterns
2. **Semantic Analysis**: Explain theta roles (Causer, Theme, Experiencer, etc.) - why the subject is a Causer not an Agent
3. **Academic Tones**: Highlight why this wording achieves Band 8.5

Keep explanation concise (200 words max), formal academic tone.`;

    const response = await this.client.post<ClaudeResponse>('', {
      model: this.model,
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.data.content[0].text.trim();
  }

  /**
   * Nâng cấp câu Support từ Band 5.5 -> Band 8.5
   */
  async upgradeToB85(
    roughIdea: string,
    mainIdea: string,
    essayTopic: string
  ): Promise<{ upgraded: string; glossary: string[] }> {
    const prompt = `You are an IELTS Writing band 8.5+ coach.

User's rough support idea (Band 5.5-6.0):
"${roughIdea}"

Main idea of the essay (Band 8.5):
"${mainIdea}"

Essay topic:
"${essayTopic}"

Task: 
1. Identify semantic clashes (wrong word tone, mismatched register)
2. Upgrade to Band 8.5 using:
   - Complex nominalization (e.g., "The emergence of X" instead of "X emerges")
   - Academic vocabulary
   - Logical connectors (Furthermore, Conversely, etc.)
3. Ensure it directly supports the main idea

Output format:
**UPGRADED**: [Your Band 8.5 version - 1-2 sentences]
**GLOSSARY**: [3-5 key academic terms/phrases used, comma-separated]
**EXPLANATION**: [1-2 lines why this upgrade works]`;

    const response = await this.client.post<ClaudeResponse>('', {
      model: this.model,
      max_tokens: 250,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.data.content[0].text.trim();
    const upgradedMatch = text.match(/\*\*UPGRADED\*\*:\s*(.+?)(?:\n|$)/s);
    const glossaryMatch = text.match(/\*\*GLOSSARY\*\*:\s*(.+?)(?:\n|$)/);

    const upgraded = upgradedMatch ? upgradedMatch[1].trim() : text;
    const glossary = glossaryMatch
      ? glossaryMatch[1].split(',').map((s) => s.trim())
      : [];

    return { upgraded, glossary };
  }

  /**
   * Tạo Main Idea cho Đoạn 2 (Body 2) với tính đối lập
   */
  async generateContrastMainIdea(
    essayTopic: string,
    body1MainIdea: string
  ): Promise<string> {
    const prompt = `You are an IELTS Writing band 8.5+ examiner.

Essay topic: "${essayTopic}"

Main idea of Body 1: "${body1MainIdea}"

Generate a contrasting main idea for Body 2 that:
- Presents a counter-argument or alternative perspective
- Uses transition phrases: "Conversely", "On the flip side", "In contrast", "However"
- Maintains Band 8.5+ sophistication
- Is 1-2 sentences max

Output ONLY the contrasting main idea, nothing else.`;

    const response = await this.client.post<ClaudeResponse>('', {
      model: this.model,
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.data.content[0].text.trim();
  }

  /**
   * Export hoàn chỉnh bài essay từ các ý chính
   */
  async exportEssay(
    topic: string,
    mainIdeas: string[],
    supportIdeas: string[][]
  ): Promise<string> {
    const bodyStructure = mainIdeas
      .map((main, idx) => {
        const supports = supportIdeas[idx]?.join(' ') || '';
        return `**Main Idea**: ${main}\n**Support**: ${supports}`;
      })
      .join('\n\n');

    const prompt = `You are an IELTS Writing examiner.

Synthesize this essay structure into a polished Band 8.5+ essay:

**Topic**: ${topic}

**Structure**:
${bodyStructure}

Requirements:
- Write full paragraphs (not bullet points)
- Include introduction (3-4 lines) and conclusion (3-4 lines)
- Smooth transitions between ideas
- Maintain academic tone throughout
- Approximately 250-300 words

Output: Complete essay ready for submission.`;

    const response = await this.client.post<ClaudeResponse>('', {
      model: this.model,
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.data.content[0].text.trim();
  }
}

export const initializeClaudeService = (apiKey: string) => {
  return new ClaudeService(apiKey);
};
