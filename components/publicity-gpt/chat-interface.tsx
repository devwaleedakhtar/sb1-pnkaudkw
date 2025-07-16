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
} from "lucide-react";
import { ChatMessage, MediaFilters } from "@/lib/types";
import { MockAIChat, ChatResponse } from "@/lib/mock-ai-chat";
import { ManualFilterAdjustment } from "./manual-filter-adjustment";

interface ChatInterfaceProps {
  onFiltersGenerated: (filters: MediaFilters, query: string) => void;
  onSaveFilter: (
    name: string,
    description: string,
    query: string,
    filters: MediaFilters
  ) => void;
  onRunSearch: (filters: MediaFilters, query: string) => void;
}

export function ChatInterface({
  onFiltersGenerated,
  onSaveFilter,
  onRunSearch,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<MediaFilters | null>(
    null
  );
  const [currentQuery, setCurrentQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [showManualAdjustment, setShowManualAdjustment] = useState(false);

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
        "Hello! I'm here to help you find relevant media coverage. You can ask me things like:\n\n• Show me positive coverage from last week\n• Find articles about our product launch\n• Get social media mentions with high reach\n• Search for news from specific outlets\n\nWhat would you like to search for?",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    setSuggestions([
      "Show me positive coverage from last week",
      "Find articles about our product launch",
      "Get social media mentions with high reach",
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
    setIsLoading(true);

    try {
      const response: ChatResponse = await aiChat.processMessage(content);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.message,
        timestamp: new Date(),
        filters: response.filters,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSuggestions(response.suggestions || []);

      if (response.filters) {
        setCurrentFilters(response.filters);
        setCurrentQuery(content);
        onFiltersGenerated(response.filters, content);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSendMessage(suggestion);
  };

  const handleRunSearch = () => {
    if (currentFilters) {
      onRunSearch(currentFilters, currentQuery);
    }
  };

  const handleSaveFilter = () => {
    if (currentFilters && filterName.trim()) {
      onSaveFilter(
        filterName.trim(),
        `AI-generated filter: ${currentQuery}`,
        currentQuery,
        currentFilters
      );
      setShowSaveDialog(false);
      setFilterName("");
    }
  };

  const handleManualAdjustment = () => {
    setShowManualAdjustment(true);
  };

  const handleManualFiltersChange = (filters: MediaFilters) => {
    setCurrentFilters(filters);
    onFiltersGenerated(filters, currentQuery);
  };

  const handleManualSave = () => {
    setShowSaveDialog(true);
    setShowManualAdjustment(false);
  };

  const handleManualRunSearch = () => {
    if (currentFilters) {
      onRunSearch(currentFilters, currentQuery);
      setShowManualAdjustment(false);
    }
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, index) => (
      <div key={index} className={index > 0 ? "mt-2" : ""}>
        {line}
      </div>
    ));
  };

  if (showManualAdjustment && currentFilters) {
    return (
      <ManualFilterAdjustment
        filters={currentFilters}
        onFiltersChange={handleManualFiltersChange}
        onSave={handleManualSave}
        onRunSearch={handleManualRunSearch}
        onClose={() => setShowManualAdjustment(false)}
      />
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          AI Chat Assistant
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {formatMessage(message.content)}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-600">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        {currentFilters && (
          <div className="flex-shrink-0 px-6 py-3 border-t bg-gray-50">
            <div className="flex gap-2">
              <Button size="sm" onClick={handleRunSearch} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Run Search
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSaveDialog(true)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Filter
              </Button>
            </div>
          </div>
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="flex-shrink-0 px-6 py-3 border-t bg-blue-50">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter Name:</label>
              <Input
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Enter a name for this filter..."
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveFilter}
                  disabled={!filterName.trim()}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex-shrink-0 px-6 py-3 border-t">
            <div className="text-sm text-gray-600 mb-2">Suggestions:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
              {currentFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualAdjustment}
                  className="text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Adjust Filters
                </Button>
              )}
            </div>
          </div>
        )}
        {/* Input Area - Inside the chat container */}
        <div className="flex-shrink-0 px-6 py-4 border-t">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about media coverage..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
