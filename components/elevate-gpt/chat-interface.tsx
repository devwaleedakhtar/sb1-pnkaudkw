"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  Save,
  Play,
  Loader2,
  Settings,
  Users,
} from "lucide-react";
import { ChatMessage, InfluencerFilters } from "@/lib/types";
import { MockAIChat, InfluencerChatResponse } from "@/lib/mock-ai-chat";

interface ChatInterfaceProps {
  onFiltersGenerated: (filters: InfluencerFilters, query: string) => void;
  onSaveFilter: (
    name: string,
    description: string,
    query: string,
    filters: InfluencerFilters
  ) => void;
  onRunSearch: (filters: InfluencerFilters, query: string) => void;
}

export function ChatInterface({
  onFiltersGenerated,
  onSaveFilter,
  onRunSearch,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] =
    useState<InfluencerFilters | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [showManualAdjustment, setShowManualAdjustment] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const aiChat = MockAIChat.getInstance();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: "initial",
      type: "assistant",
      content:
        "Hello! I'm here to help you find the perfect influencers for your campaign. You can ask me things like:\n\n• Find tech YouTubers with over 100k subscribers\n• Show me fashion influencers on Instagram with high engagement\n• Get micro-influencers in the fitness niche\n• Search for verified gaming streamers\n\nWhat type of influencers are you looking for?",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    setSuggestions([
      "Find tech YouTubers with over 100k subscribers",
      "Show me fashion influencers on Instagram with high engagement",
      "Get micro-influencers in the fitness niche",
    ]);
  }, []);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(false);
    setIsLoading(true);

    try {
      const response: InfluencerChatResponse =
        await aiChat.processInfluencerMessage(content);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (response.filters) {
        setCurrentFilters(response.filters);
        setCurrentQuery(content);
        onFiltersGenerated(response.filters, content);
      }

      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        content:
          "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setIsTyping(value.length > 0);
  };

  const handleSaveFilter = () => {
    if (!currentFilters || !filterName.trim()) return;

    onSaveFilter(
      filterName.trim(),
      "AI-generated influencer filter",
      currentQuery,
      currentFilters
    );

    setShowSaveDialog(false);
    setFilterName("");

    // Add confirmation message
    const confirmMessage: ChatMessage = {
      id: (Date.now() + 3).toString(),
      type: "assistant",
      content: `Great! I've saved the filter "${filterName}" for you. You can find it in your saved filters.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, confirmMessage]);
  };

  const handleRunSearch = () => {
    if (!currentFilters) return;

    onRunSearch(currentFilters, currentQuery);

    // Add confirmation message
    const confirmMessage: ChatMessage = {
      id: (Date.now() + 4).toString(),
      type: "assistant",
      content:
        "Perfect! I'm running the search with these parameters. You can view the results in the influencer grid below.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, confirmMessage]);
  };

  return (
    <Card className="h-[500px] flex flex-col overflow-hidden">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="h-4 w-4" />
          AI Chat
          <Badge variant="secondary" className="ml-auto text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Influencer Discovery
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full p-3 pb-0" ref={scrollAreaRef}>
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.type === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                        message.type === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3" />
                      )}
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg whitespace-pre-wrap break-words text-sm ${
                        message.type === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-900">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="px-3 py-2 border-t bg-blue-50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSaveFilter();
                  }
                }}
              />
              <Button onClick={handleSaveFilter} size="sm">
                Save
              </Button>
              <Button
                onClick={() => setShowSaveDialog(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && isTyping && (
          <div className="px-3 py-2 border-t bg-gray-50 flex-shrink-0">
            <div className="text-xs text-gray-500 mb-1">Suggestions:</div>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 text-xs"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t bg-white flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Input
              ref={inputRef}
              placeholder="Ask me about influencers you're looking for..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
