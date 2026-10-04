import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = await getAdminAuth().verifyIdToken(token);
    const userId = decoded.uid;

    const { message, history = [] } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const db = getAdminDb();
    const businessSnapshot = await db
      .collection("businesses")
      .where("owner_id", "==", userId)
      .limit(1)
      .get();

    if (businessSnapshot.empty) {
      return NextResponse.json({ error: "Business setup required" }, { status: 400 });
    }

    const businessDoc = businessSnapshot.docs[0];
    const business = { id: businessDoc.id, ...businessDoc.data() } as any;

    if (business.subscription_status !== "active") {
      return NextResponse.json(
        { error: "AI is available after setup and subscription activation." },
        { status: 402 }
      );
    }

    const knowledgeSnapshot = await db
      .collection("knowledge_items")
      .where("business_id", "==", business.id)
      .get();

    const knowledge = knowledgeSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return `## ${data.title || "Business knowledge"}\n${data.content || ""}`;
      })
      .join("\n\n");

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const instructions = `
You are the AI sales assistant for ${business.name}.

Only use the supplied business knowledge.

Never invent:
- prices
- availability
- policies
- services
- guarantees
- business information

If information is missing, ask a concise clarification or recommend human handover.

Be helpful, concise and sales-oriented without being pushy.

Business category:
${business.category || "Not provided"}

Location:
${business.location || "Not provided"}

Hours:
${business.hours || "Not provided"}

Business instructions:
${business.ai_instructions || "None"}

Business knowledge:
${knowledge || "No knowledge has been provided yet."}
`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions,
      input: [...history, { role: "user", content: message }],
      store: false,
    });

    return NextResponse.json({ reply: response.output_text });
  } catch (error: any) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: error?.message || "AI request failed." },
      { status: 500 }
    );
  }
}
