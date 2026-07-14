import assert from "node:assert/strict";
import test from "node:test";
import { quoteAgent } from "./agent.js";

test("returns an insurance quote for the happy path", async () => {
  const result = await quoteAgent({
    userInput: "How much is full coverage for my 2022 Toyota Corolla?",
  });

  assert.equal(result.answer, "The policy has a USD 500 deductible.");
});
