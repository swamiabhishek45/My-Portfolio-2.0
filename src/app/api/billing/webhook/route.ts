import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

import { kvGet, kvSetNx } from "@/lib/agent/memory-store";
import { grantPaidSession } from "@/lib/agent/quota";

export const dynamic = "force-dynamic";

function verifySignature(body: string, signature: string | null): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          notes?: { visitor_id?: string };
        };
      };
    };
  };

  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.event !== "payment.captured") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const paymentEntity = payload.payload?.payment?.entity;
  const paymentId = paymentEntity?.id;
  let visitorId = paymentEntity?.notes?.visitor_id;
  if (!visitorId && paymentEntity?.order_id) {
    visitorId =
      (await kvGet(`agent:order:${paymentEntity.order_id}`)) ?? undefined;
  }

  if (!paymentId || !visitorId) {
    return NextResponse.json({ error: "Missing payment metadata" }, { status: 400 });
  }

  const idempotencyKey = `agent:payment:${paymentId}`;
  const first = await kvSetNx(idempotencyKey, "1", { ex: 60 * 60 * 24 * 30 });
  if (!first) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  await grantPaidSession(visitorId);
  return NextResponse.json({ ok: true });
}
