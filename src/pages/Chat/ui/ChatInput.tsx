
import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/shared/ui/button/Button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Send } from "lucide-react";
import { GetApiApplicationzsApplicationzIdMessages200Item } from "@/api/core";


interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  messages: GetApiApplicationzsApplicationzIdMessages200Item[];
  isExpanded: boolean;
  toggleExpanded: () => void;

  selectedService: string;
  setSelectedService: (selectedService: string) => void;

  errorText?: string;
}

export const ChatInput = ({ onSendMessage, isLoading, isExpanded, toggleExpanded, messages, errorText, selectedService, setSelectedService }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  }, [message, isLoading, onSendMessage]);

  useEffect(() => {
    if (isExpanded && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isExpanded]);

  return (
    <div
      className={cn(
        "fixed left-1/2 transform -translate-x-1/2 glass transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.1)]",
        "w-[600px] max-w-[90vw] rounded-2xl mb-[50px]",
        isExpanded ? "h-80 bottom-0" : "h-24 bottom-0"
      )}
    >
      <div className="absolute -top-[56px] left-[200px] transform -translate-x-1/2 bg-white/50 rounded-t-xl p-2">
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="transform z-50 p-2 bg-white rounded-md border"
        >
          <option value="grok-chat">Grok-2-vision-1212</option>
          <option value="gpt-4o-mini-chat">GPT-4o-mini</option>
          <option value="gpt-4o-mini-thread">GPT-4o-mini code interpreter</option>
        </select>
      </div>

      <button
        onClick={toggleExpanded}
        className="absolute -top-[32px] left-[35px] transform -translate-x-1/2 bg-white/50 rounded-t-xl p-2"
      >
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>
      
      <form onSubmit={handleSubmit} className="h-full flex flex-col p-4">
        {isExpanded && (
          <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white/50 rounded-xl">
            {messages.map((msg, index) => (
              <div
                key={msg._id}
                className={cn(
                  "mb-2 p-3 rounded-xl max-w-[80%]",
                  msg.role === 'user' 
                    ? "bg-primary text-white ml-auto" 
                    : "bg-secondary mr-auto"
                )}
                ref={messages.length - 1 === index ? messagesEndRef : undefined}
              >
                <div>{msg.previewContent || msg.content}</div>
                {msg.status === 'processing' && (
                  <div>Обрабатывается ...</div>
                )}
              </div>
            ))}
            {errorText && (
              <div
                className={cn(
                  "mb-2 p-3 rounded-xl max-w-[80%]",
                  "bg-secondary mr-auto"
                )}
              >
                {errorText}
              </div>
            )}
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
