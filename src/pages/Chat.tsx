
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { createApp, getMessages, sendMessage } from "@/services/api";
import { Message } from "@/types/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Chat = () => {
  const [message, setMessage] = useState("");
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
          const app = await createApp();
          navigate(`/chat?appId=${app.id}`, { replace: true });
        } catch (error) {
          console.error('Failed to create app:', error);
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
  const { mutate: submitMessage } = useMutation({
    mutationFn: async ({ message, appId }: { message: string; appId: string }) => {
      return sendMessage(message, appId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', appId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !appId) return;
    
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

  return (
    <div className="h-screen flex flex-col md:flex-row">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen rounded-lg">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-screen flex flex-col p-4 bg-background">
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
              <div className="glass rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Start describing your website and I'll help you build it.
                </p>
              </div>

              {messages.map((msg: Message, index: number) => (
                <div
                  key={index}
                  className={`glass rounded-lg p-4 animate-in ${
                    msg.from === 'user' ? 'ml-auto max-w-[80%] bg-primary/10' : 'mr-auto max-w-[80%]'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-end gap-2 pt-4">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe your website..."
                className="flex-1 min-h-[44px] max-h-[200px] resize-none"
                rows={1}
              />
              <Button type="submit" size="icon" className="h-11 w-11">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </ResizablePanel>
        
        <ResizableHandle className="w-2 bg-muted" />
        
        <ResizablePanel defaultSize={50}>
          <div className="h-screen bg-muted p-4">
            <div className="w-full h-full rounded-lg bg-background">
              {/* Preview will be rendered here */}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
