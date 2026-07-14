export type Message = {
  role: "user" | "assistant" | "tool";
  content: string;
};

export interface QuoteRequest {
  userInput: string;
}

export interface QuoteResponse {
  answer?: string;
}

export type ToolCall = {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
};

export type LlmResponse = {
  text: string;
  tool_calls?: ToolCall[];
};
