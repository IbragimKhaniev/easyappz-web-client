import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { Menu, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ConfigurationDialog } from "@/components/ConfigurationDialog";
import { ChatMessage, LoadingMessage } from "@/features/constructor/ui/ChatMessage/ChatMessage";
import { ChatInput } from "@/features/constructor/ui/ChatInput/ChatInput";
import { PreviewPanel } from "@/features/constructor/ui/PreviewPanel/PreviewPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { useToggle } from '@/shared/lib/hooks/useToggle';
import { useMobile } from "@/hooks/use-mobile";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Applicationz = () => {
  const navigate = useNavigate();
  const { applicationzId } = useParams();
  const queryClient = useQueryClient();
  const isMobile = useMobile();

  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobileView, toggleMobileView] = useToggle(false);
  const [showConfig, setShowConfig] = useState(false);
  const [firstMessage, setFirstMessage] = useState<string | null>();
  const [keyIframe, setKeyIframe] = useState<number>(0);
  const [showChat, setShowChat] = useState(!isMobile);
  const [showPreview, setShowPreview] = useState(isMobile);

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
      },
      onError(errorData) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: errorData?.message,
        });
      }
    }
  });

  const { mutate: postMessages, mutateAsync: postMessagesAsync, isPending: isPendingPostMessages } = usePostApplicationZsApplicationzIdMessages({
    mutation: {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['getMessagesKey'], });
        queryClient.invalidateQueries({ queryKey: ['getApplicationZKey'], });
      },
      onError(errorData) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: errorData?.message,
        });
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
      },
      onError(errorData) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: errorData?.message,
        });
      }
    }
  });

  const isCommonLoading = useMemo(() => (
    isPendingPostMessages || isPendingPostApplicationZs || isLoadingMessages || applicationZ?.pending || isLoadingConfig || isPendingPromtAnalyze
  ), [applicationZ?.pending, isLoadingConfig, isLoadingMessages, isPendingPostApplicationZs, isPendingPostMessages, isPendingPromtAnalyze]);

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

    // Автоматически переключаемся на превью на мобильных устройствах
    if (isMobile) {
      setShowChat(false);
      setShowPreview(true);
    }
  }, [applicationzId, handleFirstMessage, postMessages, isMobile]);

  const toggleView = () => {
    setShowChat(!showChat);
    setShowPreview(!showPreview);
  };

  // Используем ResizablePanelGroup только на десктопах
  if (!isMobile) {
    return (
      <div className="h-screen w-full p-4 applicationz-page">
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
              <div className="bg-[#282828e6] bg-opacity-90 flex-1 overflow-hidden flex flex-col rounded-lg shadow-lg">
                <div className="flex items-center p-4 border-b border-white/10">
                  <div className="relative mr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="bg-[#3A4055] p-2 rounded-lg hover:bg-[#4A5065] transition-colors duration-200">
                          <Menu size={20} className="text-white/80" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[200px] p-2 bg-[#282828e6] rounded-lg mt-1 border border-white/10">
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-[#3A4055] transition-colors duration-200 cursor-pointer"
                          onClick={() => navigate(ROUTES.PROFILE)}
                        >
                          <User size={16} />
                          <span>Профиль</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h2 className="text-xl font-medium text-white/95">Чат с ИИ</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#282828e6]">
                  {isLoadingMessages ? (
                    <>
                      <Skeleton className="h-[60px] w-[80%] bg-[#3A4055]" />
                      <div className="flex justify-end">
                        <Skeleton className="h-[40px] w-[60%] bg-[#3A4055]" />
                      </div>
                      <Skeleton className="h-[60px] w-[70%] bg-[#3A4055]" />
                    </>
                  ) : (
                    <>
                      <ChatMessage text="Привет! Я помогу вам создать веб-приложение. Что бы вы хотели сделать?" isAI />
                      {messages?.map((msg, index) => <ChatMessage key={index} text={msg.previewContent || msg.content} isAI={msg.role === 'assistant'}  />)}
                      {isCommonLoading && <LoadingMessage loadingPercent={applicationZ?.pendingPercent} />}
                      {applicationZ?.error && (
                        <ChatMessage text={`Ошика: ${applicationZ?.errorText}`} isAI />
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <ChatInput 
                  handleSendMessage={handleSendMessage} 
                  isProcessing={isCommonLoading} 
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-transparent" />

          <ResizablePanel defaultSize={67} minSize={30}>
            <PreviewPanel
              dir={applicationZ?.dir}
              template={applicationZ?.template}
              keyIframe={keyIframe}
              isMobileView={isMobileView} 
              toggleMobileView={toggleMobileView} 
              handleReloadDemo={handleReloadDemo} 
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  // Мобильная версия использует переключение между чатом и превью
  return (
    <div className="h-screen w-full p-2 applicationz-page">
      {showConfig && promtSettings && config && (
        <ConfigurationDialog 
          open={showConfig} 
          settings={promtSettings}
          config={config}
          onOpenChange={setShowConfig} 
          onSubmit={handleConfigSubmit} 
        />
      )}
      
      {/* Переключатель между чатом и превью */}
      <div className="bg-[#282828e6] bg-opacity-90 mb-2 p-2 flex justify-between items-center rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="relative mr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-[#3A4055] p-2 rounded-lg hover:bg-[#4A5065] transition-colors duration-200">
                  <Menu size={20} className="text-white/80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] p-2 bg-[#282828e6] rounded-lg mt-1 border border-white/10">
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-[#3A4055] transition-colors duration-200 cursor-pointer"
                  onClick={() => navigate(ROUTES.PROFILE)}
                >
                  <User size={16} />
                  <span>Профиль</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h2 className="text-lg font-medium text-white/95">EasyappZ</h2>
        </div>
        <button
          onClick={toggleView}
          className="bg-[#3A4055] p-2 rounded-lg hover:bg-[#4A5065] transition-colors duration-200 flex items-center gap-1"
        >
          {showChat ? (
            <>
              <span className="text-sm text-white/80 mr-1">Превью</span>
              <ChevronRight size={16} className="text-white/80" />
            </>
          ) : (
            <>
              <ChevronLeft size={16} className="text-white/80" />
              <span className="text-sm text-white/80 ml-1">Чат</span>
            </>
          )}
        </button>
      </div>

      {/* Содержимое будет переключаться между чатом и превью */}
      <div className="h-[calc(100vh-66px)]">
        {showChat && (
          <div className="h-full flex flex-col">
            <div className="bg-[#282828e6] bg-opacity-90 flex-1 overflow-hidden flex flex-col rounded-lg shadow-lg">
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {isLoadingMessages ? (
                  <>
                    <Skeleton className="h-[60px] w-[80%] bg-[#3A4055]" />
                    <div className="flex justify-end">
                      <Skeleton className="h-[40px] w-[60%] bg-[#3A4055]" />
                    </div>
                    <Skeleton className="h-[60px] w-[70%] bg-[#3A4055]" />
                  </>
                ) : (
                  <>
                    <ChatMessage text="Привет! Я помогу вам создать веб-приложение. Что бы вы хотели сделать?" isAI />
                    {messages?.map((msg, index) => <ChatMessage key={index} text={msg.previewContent || msg.content} isAI={msg.role === 'assistant'}  />)}
                    {isCommonLoading && <LoadingMessage />}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <ChatInput 
                handleSendMessage={handleSendMessage} 
                isProcessing={isCommonLoading} 
              />
            </div>
          </div>
        )}

        {showPreview && applicationZ && (
          <div className="h-full">
            <PreviewPanel
              dir={applicationZ.dir}
              keyIframe={keyIframe}
              isMobileView={true} 
              toggleMobileView={() => {}} 
              handleReloadDemo={handleReloadDemo}
              isMobileDisplay={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Applicationz.displayName = 'Applicationz';

export default Applicationz;
