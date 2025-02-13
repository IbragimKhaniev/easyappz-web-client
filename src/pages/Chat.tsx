
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const Chat = () => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Handle message submission here
    setMessage("");
  };

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
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your website..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
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
