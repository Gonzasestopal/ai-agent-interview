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

  const policyContext = await retrievePolicyDocuments();
  const customerContext = await retrieveCustomerDocuments();

  messages.push(...policyContext);
  messages.push(...customerContext);

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

async function llm(_: {
  system: string;
  messages: Message[];
}): Promise<LlmResponse> {
  const responses = [
    "Your deductible is USD 500.",
    "The deductible is USD 1,000.",
    "You would pay the first USD 500 before coverage applies.",
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

async function retrievePolicyDocuments(): Promise<Message[]> {
  const documents = [
    "Policy version 2024: Collision deductible: USD 500.",
    "Policy version 2025: Collision deductible: USD 1,000.",
    "Theft coverage included.",
    "Glass coverage included.",
    "Roadside assistance included.",
    "Rental car coverage up to 30 days.",
    "Policy expires on 2027-01-01.",
  ];

  return documents.map(
    (content): Message => ({
      role: "assistant",
      content,
    }),
  );
}

async function retrieveCustomerDocuments(): Promise<Message[]> {
  const documents = [
    "Vehicle: 2022 Toyota Corolla.",
    "Owner: John Doe.",
    "Driver age: 35.",
  ];

  return documents.map(
    (content): Message => ({
      role: "assistant",
      content,
    }),
  );
}
