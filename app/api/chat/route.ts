import { NextRequest, NextResponse } from "next/server";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

export const runtime = "edge";

const TEMPLATE = `You make this todo task "{input}" to be in an awkward situation or even funnier, so it is to not do task instead.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.messages || body.messages.length === 0) {
      return NextResponse.json({ response: "no input" });
    }
    const messages = body.messages;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      temperature: 0.9,
      modelName: "gpt-3.5-turbo-1106",
    });

    const chain = prompt.pipe(model)
    const response = await chain.invoke({
      input: messages,
    });

    return NextResponse.json({ response });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
