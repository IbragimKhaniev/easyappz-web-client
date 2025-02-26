
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ConfigurationDialog } from "@/components/ConfigurationDialog";
import { ChatMessage, LoadingMessage } from "@/features/constructor/ui/ChatMessage/ChatMessage";
import { ChatInput } from "@/features/constructor/ui/ChatInput/ChatInput";
import { PreviewPanel } from "@/features/constructor/ui/PreviewPanel/PreviewPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { useToggle } from '@/shared/lib/hooks/useToggle';

import { 
  usePostPromtsAnalyze,
  useGetConfig,
  PostPromtsAnalyze200,
  useGetApplicationZsApplicationzIdMessages,
  usePostApplicationZsApplicationzIdMessages,
  usePostApplicationZs,
  useGetApplicationZsId
} from '@/api/core';
import { ROUTES } from '@/constants/routes';
import { useQueryClient } from '@tanstack/react-query';

const Applicationz = () => {
  const navigate = useNavigate();
  const { applicationzId } = useParams();
  const queryClient = useQueryClient();

  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobileView, toggleMobileView] = useToggle(false);
  const [showConfig, setShowConfig] = useState(false);
  const [firstMessage, setFirstMessage] = useState<string | null>();
  const [keyIframe, setKeyIframe] = useState<number>(0);

  /**
   * Характеристики основанные первом сообщении
   */
  const [promtSettings, setPromtSettings] = useState<PostPromtsAnalyze200 | null>(null);

  const { data: config, isLoading: isLoadingConfig } = useGetConfig();

  const { data: messages, isLoading: isLoadingMessages } = useGetApplicationZsApplicationzIdMessages(applicationzId, {
    query: {
      enabled: Boolean(applicationzId),
      queryKey: ['getMessagesKey', applicationzId],
      refetchInterval: 3000,
    }
  });

  const { data: applicationZ } = useGetApplicationZsId(applicationzId, {
    query: {
      enabled: Boolean(applicationzId),
      queryKey: ['getApplicationZKey', applicationzId],
      refetchInterval: 3000,
    }
  });

  const { mutate: postPromtsAnalyze, isPending: isPendingPromtAnalyze } = usePostPromtsAnalyze({
    mutation: {
      onSuccess(data) {
        setPromtSettings(data);
        setShowConfig(true);
      }
    }
  });

  const { mutate: postMessages, mutateAsync: postMessagesAsync, isPending: isPendingPostMessages } = usePostApplicationZsApplicationzIdMessages({
    mutation: {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['getMessagesKey'], });
        queryClient.invalidateQueries({ queryKey: ['getApplicationZKey'], });
      }
    }
  });

  const { mutate: postApplicationZs, isPending: isPendingPostApplicationZs } = usePostApplicationZs({
    mutation: {
      async onSuccess(data) {
        if (!firstMessage) return;

        await postMessagesAsync({
          applicationzId: data._id,
          data: {
            content: firstMessage,
          }
        });

        navigate(generatePath(ROUTES.APPLICATIONZ, {
          applicationzId: data._id,
        }));
      }
    }
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const handleReloadDemo = useCallback(() => {
    setKeyIframe((currentKeyIframe) => currentKeyIframe + 1);
  }, []);

  useEffect(() => {
    if (applicationZ) {
      handleReloadDemo();
    }
  }, [applicationZ, handleReloadDemo]);

  const handleOpenInNewWindow = useCallback(() => {
    window.open('https://preview.example.com', '_blank');
  }, []);

  /**
   * При указании нужных настроек создаем приложение
   */
  const handleConfigSubmit = useCallback((settings: PostPromtsAnalyze200) => {
    postApplicationZs({
      data: settings,
    });
  }, [postApplicationZs]);

  /**
   * Обработка отправки первого сообщения
   */
  const handleFirstMessage = useCallback((value: string) => {
    setFirstMessage(value);
    postPromtsAnalyze({
      data: {
        message: value,
      },
    });
  }, [postPromtsAnalyze]);

  const handleSendMessage = useCallback((value: string) => {
    /**
     * Если приложение еще не создано
     */
    if (!applicationzId) {
      handleFirstMessage(value);
      return;
    }

    postMessages({
      applicationzId: applicationzId,
      data: {
        content: value,
      }
    });
  }, [applicationzId, handleFirstMessage, postMessages]);

  return (
    <div className="h-screen w-full p-4">
      {showConfig && promtSettings && config && (
        <ConfigurationDialog 
          open={showConfig} 

          settings={promtSettings}
          config={config}

          onOpenChange={setShowConfig} 

          onSubmit={handleConfigSubmit} 
        />
      )}
      <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg overflow-hidden">
        <ResizablePanel defaultSize={33} minSize={25}>
          <div className="h-full flex flex-col">
            <div className="glass-effect flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center p-4 border-b border-white/5">
                <div className="relative mr-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="menu" className="border-none">
                      <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]>svg]:hidden [&[data-state=closed]>svg]:hidden">
                        <div className="glass-effect p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
                          <Menu size={20} className="text-white/70" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="absolute top-full left-4 w-[200px] z-50">
                        <div className="flex flex-col gap-2 p-2 bg-[#1A1F2C] rounded-lg mt-2 border border-white/10">
                          <button 
                            onClick={() => navigate(ROUTES.PROFILE)} 
                            className="flex items-center gap-2 text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors duration-200 whitespace-nowrap"
                          >
                            <User size={16} />
                            <span>Профиль</span>
                          </button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <h2 className="text-xl font-medium text-white/90">Чат с ИИ</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <>
                    <Skeleton className="h-[60px] w-[80%]" />
                    <div className="flex justify-end">
                      <Skeleton className="h-[40px] w-[60%]" />
                    </div>
                    <Skeleton className="h-[60px] w-[70%]" />
                  </>
                ) : (
                  <>
                    <ChatMessage text="Привет! Я помогу вам создать веб-приложение. Что бы вы хотели сделать?" isAI />
                    {messages?.map((msg, index) => <ChatMessage key={index} text={msg.previewContent || msg.content} isAI={msg.role === 'assistant'}  />)}
                    {(isPendingPostMessages || applicationZ?.pending) && <LoadingMessage />}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <ChatInput 
                handleSendMessage={handleSendMessage} 
                isProcessing={isPendingPostMessages || isPendingPostApplicationZs || isLoadingMessages || applicationZ?.pending} 
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-transparent" />

        <ResizablePanel defaultSize={67} minSize={30}>
          {applicationZ && (
            <PreviewPanel
              dir={applicationZ.dir}
              keyIframe={keyIframe}

              isMobileView={isMobileView} 
              toggleMobileView={toggleMobileView} 
              handleReloadDemo={handleReloadDemo} 
              handleOpenInNewWindow={handleOpenInNewWindow} 
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

Applicationz.displayName = 'Applicationz';

export default Applicationz;
