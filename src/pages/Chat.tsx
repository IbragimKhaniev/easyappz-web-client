
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { createApp, getMessages, sendMessage } from "@/services/api";
import { Message } from "@/types/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [isCreatingApp, setIsCreatingApp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const searchParams = new URLSearchParams(location.search);
  const appId = searchParams.get('appId');

  // Create app if no appId
  useEffect(() => {
    const initApp = async () => {
      if (!appId) {
        try {
          setIsCreatingApp(true);
          const app = await createApp();
          navigate(`/chat?appId=${app.id}`, { replace: true });
        } catch (error) {
          console.error('Failed to create app:', error);
        } finally {
          setIsCreatingApp(false);
        }
      }
    };

    initApp();
  }, [appId, navigate]);

  // Fetch messages
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', appId],
    queryFn: () => appId ? getMessages(appId) : Promise.resolve([]),
    enabled: !!appId,
  });

  // Send message mutation
  const { mutate: submitMessage, isPending: isSending } = useMutation({
    mutationFn: async ({ message, appId }: { message: string; appId: string }) => {
      return sendMessage(message, appId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', appId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !appId || isSending) return;
    
    submitMessage({ message, appId });
    setMessage("");
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isCreatingApp) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4 bg-background">
        <Progress value={100} className="w-[60%] animate-pulse" />
        <p className="text-sm text-muted-foreground">Creating your app...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen rounded-lg">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-screen flex flex-col bg-background">
            <div className="border-b border-border/40 p-4">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="EaseAppz" className="h-8 w-8" />
                <h1 className="text-lg font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  EaseAppz
                </h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              <div className="glass rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Start describing your website and I'll help you build it.
                </p>
              </div>

              {messages.map((msg: Message, index: number) => (
                <div
                  key={index}
                  className={`glass rounded-lg p-4 animate-in ${
                    msg.from === 'user' 
                      ? 'ml-auto max-w-[80%] bg-primary/5 border-primary/20' 
                      : 'mr-auto max-w-[80%]'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border/40 p-4">
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your website..."
                  className="flex-1 min-h-[44px] max-h-[200px] resize-none bg-secondary/50"
                  rows={1}
                  disabled={isSending}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-11 w-11 bg-primary/10 hover:bg-primary/20" 
                  disabled={isSending}
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle className="w-2 bg-muted" />
        
        <ResizablePanel defaultSize={50}>
          <div className="h-screen bg-muted/20 p-4">
            <div className="w-full h-full rounded-lg bg-background border border-border/40">
              {/* Preview will be rendered here */}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
