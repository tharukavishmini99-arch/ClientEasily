import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken =
    process.env.META_WEBHOOK_VERIFY_TOKEN;

  if (
    mode === "subscribe" &&
    token === verifyToken
  ) {
    return new NextResponse(challenge || "", {
      status: 200,
    });
  }

  return NextResponse.json(
    { error: "Webhook verification failed" },
    { status: 403 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log(
      "Meta webhook:",
      JSON.stringify(body)
    );

    return NextResponse.json(
      { status: "EVENT_RECEIVED" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Meta webhook error:",
      error
    );

    return NextResponse.json(
      { error: "Invalid webhook" },
      { status: 400 }
    );
  }
}