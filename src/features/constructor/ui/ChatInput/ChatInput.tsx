
import { memo, useCallback, KeyboardEvent, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import type { ChatInputProps } from '../../model/types';

export const ChatInput = memo(({
  handleSendMessage,
  isProcessing
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setMessage("");
      handleSendMessage(message);
    }
  }, [handleSendMessage, message]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = 'auto';
    const newHeight = Math.min(target.scrollHeight, 96);
    target.style.height = `${newHeight}px`;
    setMessage(target.value);
  }, [setMessage]);

  const handleClick = useCallback(() => {
    setMessage("");
    handleSendMessage(message);
  }, [handleSendMessage, message]);

  return (
    <div className="p-4">
      <div className="flex items-start gap-3 bg-white/5 rounded-xl p-1.5 relative">
        <textarea
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={isProcessing ? "Sending message..." : "Type your message..."}
          className="flex-1 bg-transparent px-3 py-2 text-white/90 placeholder:text-white/40 focus:outline-none text-sm min-h-[44px] max-h-[96px] resize-none overflow-y-auto disabled:opacity-70"
          disabled={isProcessing}
          rows={1}
          style={{
            height: 'auto'
          }}
        />
        <button
          onClick={handleClick}
          disabled={!message.trim() || isProcessing}
          className="h-9 w-9 rounded-lg bg-[#4FD1C5] hover:bg-[#45b8ae] flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 relative"
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin text-white" />
              <span className="absolute -top-8 right-0 text-xs text-white/70 whitespace-nowrap bg-black/50 px-2 py-1 rounded-md">
                Обрабатывается...
              </span>
            </>
          ) : (
            <Send size={16} className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';
