
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../model/types';
import { usePostApplicationsApplicationIdMessagesMessageIdRetry } from '@/api/core';
import { Promt } from '../Promt';

export const ChatMessage = memo(({ data, applicationId }: ChatMessageType) => {
  const [firstLoaded, setFirstLoaded] = useState(0);
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

  useEffect(() => {
    if (data) {
      setFirstLoaded((firstLoaded) => firstLoaded + 1);
    }
  }, [data]);

  return (
    <>
      <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
        <div
          className={`max-w-[80%] p-3 rounded-2xl ${
            isAI
              ? 'bg-white/5 text-white/90'
              : 'bg-[#4FD1C5] text-black'
          }`}
        >
          <div>{data.content}</div>
        </div>
      </div>
      <>
        {data.promts?.map((currentPromt, index) => (
          <Promt
            key={index}
            data={currentPromt}
            typing={Boolean(index === data.promts.length - 1) && firstLoaded === 2}
          />
        ))}
        {(data.status === 'processing' || data.status === 'created') && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-white/5 text-white/90 p-3 rounded-2xl">
              <Loader2 size={16} className="animate-spin" />
              <span>Обрабатывается...</span>
            </div>
          </div>
        )}
        {data.status === 'error' && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-red-500 text-white/90 p-3 rounded-2xl">
              <Loader2 size={16} className="animate-spin" />
              <span>Ошибка обработки</span>
            </div>
          </div>
        )}
        {data.status === 'error' && (
          <button
          onClick={onClickRetry}
            className="mt-2 px-4 py-2 bg-white text-black rounded"
          >
            Попробовать ещё раз
          </button>
        )}
      </>
    </>
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
