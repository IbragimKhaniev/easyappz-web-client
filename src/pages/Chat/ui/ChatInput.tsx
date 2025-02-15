
import { useState, useCallback } from "react";
import { Button } from "@/shared/ui/button/Button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  messages: Message[];
}

export const ChatInput = ({ onSendMessage, isLoading, messages }: ChatInputProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  }, [message, isLoading, onSendMessage]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div
      className={cn(
        "fixed left-1/2 transform -translate-x-1/2 glass transition-all duration-300",
        "w-[600px] max-w-[90vw] rounded-2xl mb-[50px]",
        isExpanded ? "h-80 bottom-0" : "h-24 bottom-0"
      )}
    >
      <button
        onClick={toggleExpanded}
        className="absolute -top-[32px] left-[35px] transform -translate-x-1/2 bg-white rounded-t-xl p-2"
      >
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>
      
      <form onSubmit={handleSubmit} className="h-full flex flex-col p-4">
        {isExpanded && (
          <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white/50 rounded-xl">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "mb-2 p-3 rounded-xl max-w-[80%]",
                  msg.isUser 
                    ? "bg-primary text-white ml-auto" 
                    : "bg-white mr-auto"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите свой запрос..."
            className="flex-1 min-h-[60px] max-h-[120px] rounded-xl resize-none"
            disabled={isLoading}
          />
          <Button type="submit" isLoading={isLoading} className="rounded-xl aspect-square">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
