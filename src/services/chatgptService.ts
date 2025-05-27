
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatGPTResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
}

class ChatGPTService {
  private apiKey: string = '';
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(
    message: string, 
    context?: { class?: string; subject?: string; chapter?: string }
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not provided');
    }

    const systemPrompt = `You are an AI teacher assistant for Bangladeshi students following the NCTB curriculum. 
    You can respond in both Bangla and English. 
    ${context?.class ? `Current class: ${context.class}` : ''}
    ${context?.subject ? `Current subject: ${context.subject}` : ''}
    ${context?.chapter ? `Current chapter: ${context.chapter}` : ''}
    
    Provide educational, helpful, and accurate responses based on the NCTB curriculum. 
    Always be encouraging and supportive to students.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatGPTResponse = await response.json();
      return data.choices[0]?.message?.content || 'দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।';
    } catch (error) {
      console.error('ChatGPT API error:', error);
      throw new Error('AI সেবা সাময়িকভাবে অনুপলব্ধ। পরে আবার চেষ্টা করুন।');
    }
  }
}

export const chatGPTService = new ChatGPTService();
