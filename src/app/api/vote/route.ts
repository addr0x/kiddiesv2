import { isAdminSession } from "@/lib/admin-auth";
import { verifyPaystackTransaction } from "@/lib/paystack";
import {
  recordAdminVote,
  recordBankTransferVote,
  recordVerifiedPaystackVote,
  VoteError,
} from "@/lib/votes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { contestantId, voterName, voteMethod, keepAnonymous, reference } = data;

    if (!contestantId || !voteMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (voteMethod === "paystack") {
      if (!reference) {
        return NextResponse.json({ error: "Payment reference is required" }, { status: 400 });
      }

      let verification;
      try {
        verification = await verifyPaystackTransaction(reference);
      } catch {
        return NextResponse.json({ error: "Could not verify payment" }, { status: 502 });
      }

      if (!verification.status || verification.data.status !== "success") {
        return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 });
      }

      if (verification.data.reference !== reference) {
        return NextResponse.json({ error: "Payment reference mismatch" }, { status: 400 });
      }

      const result = await recordVerifiedPaystackVote({
        reference,
        amountInKobo: verification.data.amount,
        customerEmail: verification.data.customer?.email,
        currency: verification.data.currency,
        voterName,
        keepAnonymous: keepAnonymous ?? false,
      });

      if (result.alreadyProcessed) {
        return NextResponse.json({ alreadyProcessed: true });
      }

      return NextResponse.json(result.contestant);
    } else if (voteMethod === "bank_tx" || voteMethod === "admin_paystack") {
      if (!(await isAdminSession())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const input = {
        contestantId,
        amount: Number(data.amount),
        voterName,
      };
      const result = voteMethod === "admin_paystack"
        ? await recordAdminVote({ ...input, voteMethod: "paystack" })
        : await recordBankTransferVote(input);

      if (result.alreadyProcessed) {
        return NextResponse.json({ alreadyProcessed: true });
      }

      return NextResponse.json({
        ...result.contestant,
        numberOfVotes: Math.floor(input.amount / 50),
      });
    } else {
      return NextResponse.json({ error: "Invalid vote method" }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof VoteError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Error posting vote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
