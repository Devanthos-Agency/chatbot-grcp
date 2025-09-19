import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { DEVANTHOS_SYSTEM_PROMPT } from "@/lib/devanthos-prompt";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json();

        // Create a chat completion stream with Google Gemini
        const result = await streamText({
            model: google("gemini-2.5-flash"),
            system: DEVANTHOS_SYSTEM_PROMPT,
            messages: convertToModelMessages(messages),
            temperature: 0.7,
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Error in chat API route:", error);
        return new Response("Error processing request", { status: 500 });
    }
}
