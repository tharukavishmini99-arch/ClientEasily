import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) return NextResponse.json({ id: null });

    const snapshot = await getAdminDb()
      .collection("creators")
      .where("referral_code", "==", code)
      .limit(1)
      .get();

    return NextResponse.json({
      id: snapshot.empty ? null : snapshot.docs[0].id,
    });
  } catch (error) {
    console.error("Referral resolve error:", error);
    return NextResponse.json({ id: null }, { status: 500 });
  }
}
