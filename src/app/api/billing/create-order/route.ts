import Razorpay from "razorpay";
import { NextResponse } from "next/server";

import {
  attachVisitorCookie,
  ensureVisitorId,
} from "@/lib/agent/ensure-visitor";
import { kvSet } from "@/lib/agent/memory-store";

export const dynamic = "force-dynamic";

const AMOUNT_PAISE = parseInt(
  process.env.RAZORPAY_AMOUNT_PAISE ?? "4200",
  10
);

export async function POST() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Billing is not configured" },
      { status: 503 }
    );
  }

  const { visitorId, setCookie, cookieValue } = await ensureVisitorId();

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const order = await razorpay.orders.create({
    amount: AMOUNT_PAISE,
    currency: "INR",
    receipt: `agent_${visitorId.slice(0, 8)}_${Date.now()}`,
    notes: { visitor_id: visitorId },
  });

  await kvSet(`agent:order:${order.id}`, visitorId, { ex: 60 * 60 * 24 });

  const response = NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
  });

  if (setCookie && cookieValue) attachVisitorCookie(response, cookieValue);
  return response;
}
