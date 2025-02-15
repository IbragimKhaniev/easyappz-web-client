
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/shared/config/routes";
import { ChatInput } from "./ui/ChatInput";
import { LoadingCircle } from "./ui/LoadingCircle";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

export const ChatPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setProgress(0);
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: message,
      isUser: true
    }]);

    // Simulate AI response
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          
          // Add AI response
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: "Thank you for your message! I'm here to help you create amazing web applications.",
            isUser: false
          }]);
          
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  }, []);

  return (
    <div className="min-h-screen">
      <Link
        to={ROUTES.HOME}
        className="fixed top-6 left-6 z-50 p-2 hover:bg-secondary rounded-full transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
      </Link>
      
      {isLoading && (
        <div className="fixed top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <LoadingCircle progress={progress} />
        </div>
      )}
      
      <div className="w-full h-screen bg-secondary">
        {/* Preview iframe would go here */}
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
        messages={messages}
      />
    </div>
  );
};
