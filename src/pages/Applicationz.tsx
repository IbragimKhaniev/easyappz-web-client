
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Menu, User, LogOut, Monitor, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { useTheme } from "@/hooks/use-theme";
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

const Applicationz = () => {
  const navigate = useNavigate();
  const { applicationzId } = useParams();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "gray" : "dark");
  };

  const toggleView = () => {
    setShowChat(!showChat);
    setShowPreview(!showPreview);
  };

  // Используем ResizablePanelGroup только на десктопах
  if (!isMobile) {
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="glass-effect p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
                          <Menu size={20} className="text-white/70" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[200px] p-2 bg-[#1A1F2C] rounded-lg mt-1 border border-white/10">
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                          onClick={() => navigate(ROUTES.PROFILE)}
                        >
                          <User size={16} />
                          <span>Профиль</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                          onClick={toggleTheme}
                        >
                          {theme === "dark" ? <Monitor size={16} /> : <Moon size={16} />}
                          <span>{theme === "dark" ? "Серая тема" : "Тёмная тема"}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                      {(isPendingPostMessages || applicationZ?.pending) && <LoadingMessage loadingPercent={applicationZ?.pendingPercent} />}
                      {applicationZ?.error && (
                        <ChatMessage text={`Ошика: ${applicationZ?.errorText}`} isAI />
                      )}
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
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  // Мобильная версия использует переключение между чатом и превью
  return (
    <div className="h-screen w-full p-2">
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
      <div className="glass-effect mb-2 p-2 flex justify-between items-center">
        <div className="flex items-center">
          <div className="relative mr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="glass-effect p-2 rounded-lg hover:bg-white/5 transition-colors duration-200">
                  <Menu size={20} className="text-white/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] p-2 bg-[#1A1F2C] rounded-lg mt-1 border border-white/10">
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                  onClick={() => navigate(ROUTES.PROFILE)}
                >
                  <User size={16} />
                  <span>Профиль</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-white/60 hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? <Monitor size={16} /> : <Moon size={16} />}
                  <span>{theme === "dark" ? "Серая тема" : "Тёмная тема"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h2 className="text-lg font-medium text-white/90">EasyappZ</h2>
        </div>
        <button
          onClick={toggleView}
          className="glass-effect p-2 rounded-lg hover:bg-white/5 transition-colors duration-200 flex items-center gap-1"
        >
          {showChat ? (
            <>
              <span className="text-sm text-white/70 mr-1">Превью</span>
              <ChevronRight size={16} className="text-white/70" />
            </>
          ) : (
            <>
              <ChevronLeft size={16} className="text-white/70" />
              <span className="text-sm text-white/70 ml-1">Чат</span>
            </>
          )}
        </button>
      </div>

      {/* Содержимое будет переключаться между чатом и превью */}
      <div className="h-[calc(100vh-66px)]">
        {showChat && (
          <div className="h-full flex flex-col">
            <div className="glass-effect flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
