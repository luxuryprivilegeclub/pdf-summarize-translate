
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DocumentChatProps {
  documentText: string;
}

export function DocumentChat({ documentText }: DocumentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I can answer questions about the document you've uploaded. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!documentText) {
      toast.error("Please upload a document first to chat about it.");
      return;
    }

    // Add user message to chat
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Using the DeepSeek API through OpenRouter
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
          'HTTP-Referer': window.location.href,
          'X-Title': 'PDF Processor'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat:free',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that helps users understand their document. Here is the document text:\n\n${documentText.substring(0, 8000)}\n\nAnswer questions based on this document. Be concise and accurate.`
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: input }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API returned error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.choices && data.choices[0]?.message) {
        const assistantMessage = {
          role: "assistant" as const,
          content: data.choices[0].message.content,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Failed to get a response. Please try again.");
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Chat about your document</h3>
      </div>
      
      <ScrollArea className="flex-1 p-4 border rounded-lg bg-card h-[350px] mb-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                  <span className="text-xs font-medium">
                    {message.role === "user" ? "You" : "Assistant"}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex items-center space-x-2 mb-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs font-medium">Assistant</span>
                </div>
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex space-x-2">
        <Input
          placeholder="Ask about your document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading || !input.trim()}
          className="bg-primary hover:bg-primary/80"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
