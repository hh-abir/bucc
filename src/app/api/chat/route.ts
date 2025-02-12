import { readContextFile } from "@/lib/fileReader";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const context = await readContextFile("/context.txt");

  const formattedMessages = [
    {
      role: "system",
      content: `You are a helpful assistant. If you were asked about anything other than university or club related then answer it in the simplest form and then tell that you are here to help questions related to university and clubs. Use the following context to answer questions: ${context}`,
    },
    ...messages,
  ];

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: formattedMessages,
  });
  return result.toDataStreamResponse();
}
