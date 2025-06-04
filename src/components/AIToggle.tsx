
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bot, X } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';

const AIToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Bot className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[80vh] bg-white p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-gray-800 flex items-center justify-between">
              <span className="flex items-center">
                <Bot className="mr-2 h-5 w-5" />
                AI সহায়ক
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <AIAssistant />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIToggle;
