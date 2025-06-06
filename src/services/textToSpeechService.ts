
// Text-to-Speech service using ElevenLabs
class TextToSpeechService {
  private apiKey = 'sk_245e87825c0de4f9108ca671378b9989474894999e9a7b10';
  private baseUrl = 'https://api.elevenlabs.io/v1';

  // Default voice - Sarah (EXAVITQu4vr4xnSDxMaL)
  private defaultVoiceId = 'EXAVITQu4vr4xnSDxMaL';

  async generateSpeech(text: string, voiceId: string = this.defaultVoiceId): Promise<ArrayBuffer> {
    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Text-to-speech failed: ${response.statusText}`);
    }

    return await response.arrayBuffer();
  }

  async playText(text: string, voiceId?: string): Promise<void> {
    try {
      const audioData = await this.generateSpeech(text, voiceId);
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      await audio.play();
      
      // Clean up URL after playing
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
      });
    } catch (error) {
      console.error('Error playing text-to-speech:', error);
    }
  }

  // Get available voices
  async getVoices(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'xi-api-key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices;
  }
}

export const textToSpeechService = new TextToSpeechService();
