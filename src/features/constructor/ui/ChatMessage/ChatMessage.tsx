
import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../model/types';

export const ChatMessage = memo(({ text, isAI, status }: ChatMessageType) => (
  <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
    <div
      className={`max-w-[80%] p-3 rounded-2xl ${
        isAI
          ? 'bg-white/5 text-white/90'
          : 'bg-[#4FD1C5] text-black'
      }`}
    >
      <div>{text}</div>
      {status === 'processing' && (
        <div className="flex items-center gap-2 text-[#f2f2f2]">
          <Loader2 size={16} className="animate-spin" />
          <span>Обрабатывается...</span>
        </div>
      )}
      {status === 'created' && (
        <div className="flex items-center gap-2 text-[#f2f2f2]">
          <Loader2 size={16} className="animate-spin" />
          <span>В очереди...</span>
        </div>
      )}
    </div>
  </div>
));

ChatMessage.displayName = 'ChatMessage';

interface ILoadingMessageProps {
  loadingPercent?: number;
}

export const LoadingMessage = memo((props: ILoadingMessageProps) => (
  <div className="flex justify-start">
    <div className="flex items-center gap-2 bg-white/5 text-white/90 p-3 rounded-2xl">
      <Loader2 size={16} className="animate-spin" />
      <span>Обрабатывается ({props.loadingPercent ||0}%)...</span>
    </div>
  </div>
));

LoadingMessage.displayName = 'LoadingMessage';
