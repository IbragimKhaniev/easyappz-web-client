
import { memo, useCallback, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../model/types';
import { usePostApplicationsApplicationIdMessagesMessageIdRetry } from '@/api/core';

export const ChatMessage = memo(({ data, applicationId }: ChatMessageType) => {
  const { mutateAsync } = usePostApplicationsApplicationIdMessagesMessageIdRetry();

  const onClickRetry = useCallback(() => {
    mutateAsync({
      messageId: data.id,
      applicationId,
    });
  }, [applicationId, data.id, mutateAsync]);

  const isAI = useMemo(() => (
    data.role === 'assistant'
  ), [data.role]);

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-2xl ${
          isAI
            ? 'bg-white/5 text-white/90'
            : 'bg-[#4FD1C5] text-black'
        }`}
      >
        <div>{data.content}</div>
        <div>status: {data.status}</div>
        {data.promts?.map((currentPromt, index) => (
          <div key={index} className="flex items-center gap-2 text-[#f2f2f2]"
            style={{
              backgroundColor: currentPromt.status === 'error' ? '#FF4C4C' : '#ccc',
              padding: '5px',
              borderRadius: '10px',
              marginTop: '5px',
              color: currentPromt.status === 'error' ? '#fff' : '#000',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '20px',
            }}
          >
            <span>{currentPromt.result || currentPromt.content}</span>
            <span style={{
              background: '#ccc',
            }}>{currentPromt.status}</span>
          </div>
        ))}
        {data.status === 'error' && (
          <button onClick={onClickRetry}>Попробовать еще раз</button>
        )}
      </div>
    </div>
  );
});

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
