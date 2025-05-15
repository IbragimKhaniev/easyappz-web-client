import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ConfigurationDialog } from "@/components/ConfigurationDialog";
import { ChatMessage } from "@/features/constructor/ui/ChatMessage/ChatMessage";
import { ChatInput } from "@/features/constructor/ui/ChatInput/ChatInput";
import { PreviewPanel } from "@/features/constructor/ui/PreviewPanel/PreviewPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { useToggle } from '@/shared/lib/hooks/useToggle';
import { useMobile } from "@/hooks/use-mobile";

import { 
  usePostPromtsAnalyze,
  useGetConfig,
  PostPromtsAnalyze200,
  useGetApplicationsApplicationIdMessages,
  usePostApplicationsApplicationIdMessages,
  usePostApplications,
  useGetApplicationsId,
  useGetApplicationsApplicationIdLogs,
} from '@/api/core';
import { ROUTES } from '@/constants/routes';
import { useQueryClient } from '@tanstack/react-query';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Application = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const queryClient = useQueryClient();
  const isMobile = useMobile();

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

  const { data: logs } = useGetApplicationsApplicationIdLogs(applicationId, {
    query: {
      enabled: Boolean(applicationId),
      queryKey: ['getLogsKey', applicationId],
      refetchInterval: 3000,
    }
  });

  const { data: messages, isLoading: isLoadingMessages } = useGetApplicationsApplicationIdMessages(applicationId, {
    query: {
      enabled: Boolean(applicationId),
      queryKey: ['getMessagesKey', applicationId],
      refetchInterval: 3000,
    }
  });

  const { data: application } = useGetApplicationsId(applicationId, {
    query: {
      enabled: Boolean(applicationId),
      queryKey: ['getApplicationKey', applicationId],
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

  const { mutate: postMessages, mutateAsync: postMessagesAsync, isPending: isPendingPostMessages } = usePostApplicationsApplicationIdMessages({
    mutation: {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['getMessagesKey'], });
        queryClient.invalidateQueries({ queryKey: ['getApplicationKey'], });
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

  const { mutate: postApplications, isPending: isPendingPostApplications } = usePostApplications({
    mutation: {
      async onSuccess(data) {
        if (!firstMessage) return;

        await postMessagesAsync({
          applicationId: data._id,
          data: {
            content: firstMessage,
          }
        });

        navigate(generatePath(ROUTES.APPLICATION, {
          applicationId: data._id,
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

  const handleFixDeployingError = useCallback(() => {
    if (application?.deployingError) {
      postMessages({
        applicationId: applicationId,
        data: {
          content: `
            Исправь ошибку: ${application.deployingError}
            Для контекста все логи: ${logs.logs.map(log => log.content).join(';')}
          `,
        },
      });
    }
  }, [application.deployingError, applicationId, logs.logs, postMessages]);

  const handleFixCodeWarning = useCallback(() => {
    const warningLogs = logs?.logs.filter((log) => log.type === 'warning' || log.type === 'error');

    postMessages({
      applicationId: applicationId,
      data: {
        content: `
        Исправь ошибки: ${warningLogs.map(log => log.content).join(';')}
        Для контекста все логи: ${logs.logs.map(log => log.content).join(';')}
      `,
      },
    });
  }, [applicationId, logs?.logs, postMessages]);

  const warningLogs = useMemo(() => {
    if (!logs) return [];

    return logs.logs.filter((log) => log.type === 'warning' || log.type === 'error');
  }, [logs]);

  const isCommonLoading = useMemo(() => (
    isPendingPostMessages || isPendingPostApplications || isLoadingMessages || application?.pending || isLoadingConfig || isPendingPromtAnalyze
  ), [application?.pending, isLoadingConfig, isLoadingMessages, isPendingPostApplications, isPendingPostMessages, isPendingPromtAnalyze]);

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
    if (application) {
      handleReloadDemo();
    }
  }, [application, handleReloadDemo]);

  /**
   * При указании нужных настроек создаем приложение
   */
  const handleConfigSubmit = useCallback((settings: PostPromtsAnalyze200) => {
    postApplications({
      data: settings,
    });
  }, [postApplications]);

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
    if (!applicationId) {
      handleFirstMessage(value);
      return;
    }

    postMessages({
      applicationId: applicationId,
      data: {
        content: value,
      }
    });
  }, [applicationId, handleFirstMessage, postMessages]);

  return (
    <div className="h-screen w-full p-4 application-page">
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
                {/* ...existing header... */}
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
                    {messages?.map((msg, index) => (
                      <ChatMessage
                        key={index}
                        data={msg}
                        applicationId={applicationId}
                        isLast={index === messages.length - 1}
                      />
                    ))}
                    {application?.deploying && (
                      <div>Приложение деплоится ...</div>
                    )}
                    {application?.deployingError && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-2xl bg-red-500 text-white">
                          <div>При запуске сервера произошла ошибка, давайте попробуем исправить.</div>
                          <button 
                            onClick={handleFixDeployingError} 
                            className="mt-2 px-4 py-2 bg-white text-red-500 rounded"
                          >
                            Попробовать исправить
                          </button>
                        </div>
                      </div>
                    )}
                    {warningLogs.length ? (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-2xl bg-red-500 text-white">
                          <div>На сервере есть ошибки, можем попробовать их исправить.</div>
                          <button
                            onClick={handleFixCodeWarning} 
                            className="mt-2 px-4 py-2 bg-white text-red-500 rounded"
                          >
                            Попробовать исправить
                          </button>
                        </div>
                      </div>
                    ) : null}
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
          {application && (
            <PreviewPanel
              application={application}
              keyIframe={keyIframe}
              isMobileView={isMobileView} 
              toggleMobileView={toggleMobileView} 
              handleReloadDemo={handleReloadDemo} 
              logs={logs}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

Application.displayName = 'Application';

export default Application;
