import { ChatMessage, MediaFilters, SavedFilter } from "./types";

export interface ChatResponse {
  message: string;
  filters?: MediaFilters;
  canSave?: boolean;
  suggestions?: string[];
}

export class MockAIChat {
  private static instance: MockAIChat;
  private savedFilters: SavedFilter[] = [];

  static getInstance(): MockAIChat {
    if (!MockAIChat.instance) {
      MockAIChat.instance = new MockAIChat();
    }
    return MockAIChat.instance;
  }

  async processMessage(message: string): Promise<ChatResponse> {
    // Simulate AI processing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const lowercaseMessage = message.toLowerCase();

    // Handle greeting
    if (this.isGreeting(lowercaseMessage)) {
      return {
        message:
          "Hello! I'm here to help you find relevant media coverage. You can ask me things like:\n\n• Show me positive coverage from last week\n• Find articles about our product launch\n• Get social media mentions with high reach\n• Search for news from specific outlets\n\nWhat would you like to search for?",
        suggestions: [
          "Show me positive coverage from last week",
          "Find articles about our product launch",
          "Get social media mentions with high reach",
        ],
      };
    }

    // Handle filter generation requests
    if (this.isFilterRequest(lowercaseMessage)) {
      const filters = this.generateFilters(lowercaseMessage);
      const description = this.generateFilterDescription(filters);

      return {
        message: `I've created a search filter based on your request:\n\n${description}\n\nWould you like me to run this search or would you like to modify anything?`,
        filters,
        canSave: true,
        suggestions: [
          "Run this search",
          "Save this filter",
          "Modify the date range",
          "Add more media types",
        ],
      };
    }

    // Handle save requests
    if (this.isSaveRequest(lowercaseMessage)) {
      return {
        message:
          "Great! I'll save this filter for you. What would you like to name it?",
        canSave: true,
        suggestions: [
          "Product Launch Coverage",
          "Weekly Positive News",
          "Social Media Mentions",
        ],
      };
    }

    // Handle search execution
    if (this.isSearchRequest(lowercaseMessage)) {
      return {
        message:
          "Perfect! I'll run the search with these filters. You can view the results in the main table.",
        suggestions: [
          "Save this filter for later",
          "Modify the search parameters",
          "Export the results",
        ],
      };
    }

    // Default response with filter generation
    const filters = this.generateFilters(lowercaseMessage);
    const description = this.generateFilterDescription(filters);

    return {
      message: `Based on your request, I've set up these search parameters:\n\n${description}\n\nWould you like me to run this search?`,
      filters,
      canSave: true,
      suggestions: [
        "Run this search",
        "Save this filter",
        "Refine the parameters",
      ],
    };
  }

  private isGreeting(message: string): boolean {
    const greetings = ["hello", "hi", "hey", "start", "help"];
    return greetings.some((greeting) => message.includes(greeting));
  }

  private isFilterRequest(message: string): boolean {
    const filterWords = ["show", "find", "search", "get", "look for", "filter"];
    return filterWords.some((word) => message.includes(word));
  }

  private isSaveRequest(message: string): boolean {
    const saveWords = ["save", "store", "remember", "keep"];
    return saveWords.some((word) => message.includes(word));
  }

  private isSearchRequest(message: string): boolean {
    const searchWords = ["run", "execute", "go", "search now", "do it"];
    return searchWords.some((word) => message.includes(word));
  }

  private generateFilters(message: string): MediaFilters {
    const filters: MediaFilters = {
      dateRange: { start: "", end: "" },
      mediaTypes: [],
      sentiment: [],
      outlets: [],
      minReach: 0,
    };

    // Date range detection - always add a date range for more comprehensive filters
    if (message.includes("last week") || message.includes("past week")) {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      filters.dateRange.start = date.toISOString().split("T")[0];
    } else if (
      message.includes("last month") ||
      message.includes("past month")
    ) {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      filters.dateRange.start = date.toISOString().split("T")[0];
    } else if (message.includes("today") || message.includes("recent")) {
      const date = new Date();
      filters.dateRange.start = date.toISOString().split("T")[0];
    } else {
      // Default to last 30 days for more comprehensive filtering
      const date = new Date();
      date.setDate(date.getDate() - 30);
      filters.dateRange.start = date.toISOString().split("T")[0];
    }

    // Media types detection - add multiple types for richer filters
    if (message.includes("social media") || message.includes("social")) {
      filters.mediaTypes.push("Social Media");
    }
    if (message.includes("news") || message.includes("articles")) {
      filters.mediaTypes.push("Online News");
    }
    if (message.includes("print") || message.includes("newspaper")) {
      filters.mediaTypes.push("Print Media");
    }
    if (message.includes("broadcast") || message.includes("tv")) {
      filters.mediaTypes.push("Broadcast");
    }
    if (message.includes("podcast")) {
      filters.mediaTypes.push("Podcast");
    }
    if (message.includes("blog")) {
      filters.mediaTypes.push("Blog");
    }

    // Add default media types if none specified to make filters more comprehensive
    if (filters.mediaTypes.length === 0) {
      filters.mediaTypes.push("Online News", "Social Media", "Blog");
    }

    // Sentiment detection
    if (
      message.includes("positive") ||
      message.includes("good") ||
      message.includes("praise")
    ) {
      filters.sentiment.push("positive");
    }
    if (
      message.includes("negative") ||
      message.includes("bad") ||
      message.includes("criticism")
    ) {
      filters.sentiment.push("negative");
    }
    if (message.includes("neutral")) {
      filters.sentiment.push("neutral");
    }

    // Reach detection
    if (
      message.includes("high reach") ||
      message.includes("popular") ||
      message.includes("viral")
    ) {
      filters.minReach = 100000;
    } else if (
      message.includes("medium reach") ||
      message.includes("moderate")
    ) {
      filters.minReach = 10000;
    }

    // Outlet detection
    if (message.includes("techcrunch") || message.includes("tech crunch")) {
      filters.outlets.push("TechCrunch");
    }
    if (message.includes("forbes")) {
      filters.outlets.push("Forbes");
    }
    if (message.includes("reuters")) {
      filters.outlets.push("Reuters");
    }
    if (message.includes("bloomberg")) {
      filters.outlets.push("Bloomberg");
    }
    if (message.includes("wired")) {
      filters.outlets.push("Wired");
    }
    if (message.includes("verge")) {
      filters.outlets.push("The Verge");
    }
    if (message.includes("cnn")) {
      filters.outlets.push("CNN");
    }

    // Add some default outlets for more comprehensive filtering
    if (
      filters.outlets.length === 0 &&
      (message.includes("tech") ||
        message.includes("product") ||
        message.includes("launch"))
    ) {
      filters.outlets.push("TechCrunch", "Wired");
    }

    return filters;
  }

  private generateFilterDescription(filters: MediaFilters): string {
    const descriptions: string[] = [];

    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      descriptions.push(`📅 Date: From ${startDate.toLocaleDateString()}`);
    }

    if (filters.mediaTypes.length > 0) {
      descriptions.push(`📰 Media Types: ${filters.mediaTypes.join(", ")}`);
    }

    if (filters.sentiment.length > 0) {
      descriptions.push(`😊 Sentiment: ${filters.sentiment.join(", ")}`);
    }

    if (filters.outlets.length > 0) {
      descriptions.push(`🏢 Outlets: ${filters.outlets.join(", ")}`);
    }

    if (filters.minReach > 0) {
      descriptions.push(
        `📊 Minimum Reach: ${filters.minReach.toLocaleString()}`
      );
    }

    return descriptions.length > 0
      ? descriptions.join("\n")
      : "📋 General search with default parameters";
  }

  saveFilter(
    name: string,
    description: string,
    query: string,
    filters: MediaFilters
  ): SavedFilter {
    const savedFilter: SavedFilter = {
      id: Date.now().toString(),
      name,
      description,
      query,
      filters,
      createdAt: new Date(),
      resultCount: Math.floor(Math.random() * 500) + 10, // Mock result count
    };

    this.savedFilters.push(savedFilter);
    return savedFilter;
  }

  getSavedFilters(): SavedFilter[] {
    return this.savedFilters;
  }

  deleteSavedFilter(id: string): boolean {
    const index = this.savedFilters.findIndex((filter) => filter.id === id);
    if (index > -1) {
      this.savedFilters.splice(index, 1);
      return true;
    }
    return false;
  }
}
