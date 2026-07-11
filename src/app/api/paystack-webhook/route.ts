import { createHmac, timingSafeEqual } from "crypto";
import { recordVerifiedPaystackVote, VoteError } from "@/lib/votes";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function isValidSignature(signature: string | null, rawBody: string) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!signature || !secretKey) return false;

  const expectedSig = createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSig, "hex");

  return (
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer)
  );
}

async function handleDonation(reference: string, amountInKobo: number) {
  const tx = await prisma.donationTransaction.findUnique({
    where: { reference },
  });

  if (!tx || tx.status === "processed") return;

  const amountPaid = Math.floor(amountInKobo / 100);
  if (amountPaid !== tx.amount) return;

  await prisma.donationTransaction.update({
    where: { reference },
    data: { status: "processed", processedAt: new Date() },
  });
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-paystack-signature");
  const rawBody = await request.text();

  if (!isValidSignature(signature, rawBody)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const reference = event.data?.reference;
  const amount = event.data?.amount;
  const customerEmail = event.data?.customer?.email;
  const currency = event.data?.currency;

  if (typeof reference !== "string" || typeof amount !== "number") {
    return NextResponse.json({ error: "Invalid charge payload" }, { status: 400 });
  }

  try {
    if (reference.startsWith("don_")) {
      await handleDonation(reference, amount);
    } else {
      await recordVerifiedPaystackVote({
        reference,
        amountInKobo: amount,
        customerEmail,
        currency,
      });
    }
  } catch (error) {
    if (error instanceof VoteError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Paystack webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
