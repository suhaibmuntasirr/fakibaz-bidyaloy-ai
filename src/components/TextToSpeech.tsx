
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader } from 'lucide-react';
import { textToSpeechService } from '@/services/textToSpeechService';

interface TextToSpeechProps {
  text: string;
  voiceId?: string;
  className?: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ 
  text, 
  voiceId, 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = async () => {
    if (isPlaying || isLoading) return;

    setIsLoading(true);
    try {
      await textToSpeechService.playText(text, voiceId);
      setIsPlaying(true);
      
      // Reset playing state after estimated duration
      const estimatedDuration = text.length * 60; // ~60ms per character
      setTimeout(() => {
        setIsPlaying(false);
      }, estimatedDuration);
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handlePlay}
      disabled={isLoading || isPlaying}
      className={`text-blue-400 hover:text-blue-300 ${className}`}
    >
      {isLoading ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
};

export default TextToSpeech;
