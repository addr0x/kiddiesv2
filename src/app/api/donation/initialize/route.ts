import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

const MIN_DONATION = 500;

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(`donation-init:${clientIp(request)}`, {
      limit: 20,
      windowMs: 10 * 60 * 1000,
    });
    if (limited) return limited;

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      return NextResponse.json({ error: "Payment is not configured" }, { status: 503 });
    }

    const body = await request.json();
    const amount = Number(body.amount);
    const donorName = typeof body.donorName === "string" ? body.donorName.trim().slice(0, 100) : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 20) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";

    if (!Number.isSafeInteger(amount) || amount < MIN_DONATION) {
      return NextResponse.json({ error: `Minimum donation is ₦${MIN_DONATION}` }, { status: 400 });
    }

    const reference = `don_${randomUUID().replaceAll("-", "")}`;
    const donorEmail = email || `${reference}@donate.kidscrown.net`;

    await prisma.donationTransaction.create({
      data: {
        reference,
        amount,
        donorName: donorName || null,
        email: email || null,
        phone: phone || null,
        message: message || null,
      },
    });

    return NextResponse.json({
      reference,
      email: donorEmail,
      amount: amount * 100,
      publicKey,
    });
  } catch (error) {
    console.error("Donation initialization error:", error);
    return NextResponse.json({ error: "Could not initialize payment" }, { status: 500 });
  }
}
