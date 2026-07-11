import { verifyPaystackTransaction } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reference = typeof body.reference === "string" ? body.reference.trim() : "";

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 });
    }

    const tx = await prisma.donationTransaction.findUnique({
      where: { reference },
    });

    if (!tx) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    if (tx.status === "processed") {
      return NextResponse.json({ message: "Donation already processed" });
    }

    const verification = await verifyPaystackTransaction(reference);

    if (!verification.status || verification.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const amountPaid = Math.floor(verification.data.amount / 100);
    if (amountPaid !== tx.amount) {
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    await prisma.donationTransaction.update({
      where: { reference },
      data: { status: "processed", processedAt: new Date() },
    });

    return NextResponse.json({ message: "Donation recorded successfully" });
  } catch (error) {
    console.error("Donation verification error:", error);
    return NextResponse.json({ error: "Could not verify donation" }, { status: 500 });
  }
}
