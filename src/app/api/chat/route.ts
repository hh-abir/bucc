import { readContextFile } from "@/lib/fileReader";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
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

    return result.toDataStreamResponse({
      getErrorMessage: (error: unknown) => {
        console.error("Error in chat API:", error);
        if (error instanceof Error) {
          return `An error occurred: ${error.message}`;
        }
        return "An unknown error occurred";
      },
    });
  } catch (error: unknown) {
    console.error("Unhandled error in chat API:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `An unexpected error occurred: ${error.message}` },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
