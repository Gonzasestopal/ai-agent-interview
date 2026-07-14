import type {
  LlmResponse,
  Message,
  QuoteRequest,
  QuoteResponse,
} from "./types.js";

const systemPrompt = `
You are an insurance assistant.
Help the user get a car insurance quote.
`;

const memory: Message[] = [];

export async function quoteAgent(input: QuoteRequest): Promise<QuoteResponse> {
  const messages: Message[] = [...memory];

  const context = await retrieveKnowledge(input);
  messages.push(...context);

  messages.push({
    role: "user",
    content: input.userInput,
  });

  let response!: LlmResponse;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      response = await llm({
        system: systemPrompt,
        messages,
      });

      break;
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }
    }
  }

  persistMessage(input.userInput, response.text);

  return {
    answer: response.text,
  };
}

async function retrieveKnowledge(_: QuoteRequest): Promise<Message[]> {
  const documents = [
    "Collision deductible: USD 500.",
    "Theft coverage included.",
    "Glass coverage included.",
    "Vehicle: 2022 Toyota Corolla.",
    "Owner: John Doe.",
    "Claim opened on 2023-08-10.",
    "Claim status: Closed.",
    "Roadside assistance included.",
    "Rental car coverage up to 30 days.",
    "Policy expires on 2027-01-01.",
  ];

  return documents.map((content) => ({
    role: "assistant",
    content,
  }));
}
async function llm(_: {
  system: string;
  messages: Message[];
}): Promise<LlmResponse> {
  const responses = [
    "Your deductible is USD 500.",
    "The policy has a USD 500 deductible.",
    "You would pay the first USD 500 before coverage applies.",
    "The deductible amount is USD 500.",
  ];

  const index = Math.floor(Math.random() * responses.length);

  return {
    text: responses[index],
  };
}

function persistMessage(userInput: string, answer: string) {
  memory.push(
    {
      role: "user",
      content: userInput,
    },
    {
      role: "assistant",
      content: answer,
    },
  );
}
