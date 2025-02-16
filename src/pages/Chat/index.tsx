
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/shared/config/routes";
import { ChatInput } from "./ui/ChatInput";
import { LoadingCircle } from "./ui/LoadingCircle";

import { useGetApiApplicationzsId, useGetApiApplicationzsApplicationzIdMessages, usePostApiApplicationzsApplicationzIdMessages } from "@/api/core";
import { useQueryClient } from "@tanstack/react-query";

export const ChatPage = () => {
  const queryClient = useQueryClient();

  const [keyIframe, setKeyIframe] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const { chatId } = useParams();

  const {
    data: applicationZ,
    isLoading: isLoadingApplicationZ,
  } = useGetApiApplicationzsId(chatId, {
    query: {
      refetchInterval: 3000,
      queryKey: ['getApplicationZ', chatId],
    }
  });

  const {
    data: messages,
    isLoading: isLoadingMessage,
  } = useGetApiApplicationzsApplicationzIdMessages(chatId, {
    query: {
      refetchInterval: 3000,
      queryKey: ['getMessagesKey', chatId],
    }
  });

  const { mutate: createMessage, isPending: isPendingCreateMessage } = usePostApiApplicationzsApplicationzIdMessages({
    mutation: {
      onSettled() {
        queryClient.invalidateQueries({ queryKey: ['getMessagesKey', chatId], });
        queryClient.invalidateQueries({ queryKey: ['getApplicationZ', chatId], });
      }
    }
  });

  const isCommonLoading = useMemo(() => (
    isLoadingApplicationZ
    || isLoadingMessage
    || isPendingCreateMessage
    || Boolean(applicationZ?.pending)
  ), [isLoadingApplicationZ, isLoadingMessage, isPendingCreateMessage, applicationZ]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!applicationZ) return;

    createMessage({
      applicationzId: applicationZ._id,
      data: {
        content: message,
      }
    });

    setIsExpanded(false);
  }, [applicationZ, createMessage]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  useEffect(() => {
    if (!applicationZ?.pending) {
      setKeyIframe((currentKeyIframe) => currentKeyIframe + 1);
    }
  }, [applicationZ]);

  useEffect(() => {
    const roleLastMessage = messages?.[messages?.length - 1]?.role;
    if (roleLastMessage === 'assistant') {
      setIsExpanded(true);
    }
  }, [messages]);

  return (
    <div className="min-h-screen">
      <Link
        to={ROUTES.HOME}
        className="fixed top-6 left-6 z-50 p-2 hover:bg-secondary rounded-full transition-colors"
      >
        <ArrowLeft className="h-6 w-6" />
      </Link>

      {applicationZ && (
        <div style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
        }}>
          <iframe
            key={keyIframe}
            src={`http://localhost:5000/${applicationZ.dir}/index.html`}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      )}

      {applicationZ && applicationZ.pending && (
        <div className="fixed top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <LoadingCircle progress={applicationZ?.pendingPercent || 0} />
        </div>
      )}

      <div className="w-full h-screen bg-secondary">
        {/* Preview iframe would go here */}
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isCommonLoading}
        messages={messages || []}
        isExpanded={isExpanded}
        toggleExpanded={toggleExpanded}
      />
    </div>
  );
};
