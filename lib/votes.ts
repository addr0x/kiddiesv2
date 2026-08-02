import "server-only";

import { Prisma } from "@prisma/client";
import { getContestConfig, stageVoteField } from "@/lib/contest-config";
import { prisma } from "@/lib/prisma";
import { sendWhatsApp } from "@/lib/termii";

export const COST_PER_VOTE = 50;

export class VoteError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

type VoteResult =
  | { alreadyProcessed: true }
  | { alreadyProcessed?: false; contestant: Awaited<ReturnType<typeof prisma.contestant.update>> };

type VerifiedPaystackVote = {
  reference: string;
  amountInKobo: number;
  customerEmail?: string;
  currency?: string;
  voterName?: string;
  keepAnonymous?: boolean;
};

type BankTransferVote = {
  contestantId: string;
  amount: number;
  voterName?: string;
};

type AdminVote = BankTransferVote & {
  voteMethod: "paystack" | "bank_tx";
};

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function assertVotingAmount(amountPaid: number) {
  const votesToAdd = Math.floor(amountPaid / COST_PER_VOTE);

  if (votesToAdd < 1) {
    throw new VoteError("Insufficient payment amount", 400);
  }

  return votesToAdd;
}

async function notifyDisplacedContestants(
  displaced: Array<{ firstName: string; whatsapp: string; parent: string }>,
  overtakingContestantName: string,
) {
  for (const d of displaced) {
    sendWhatsApp(
      d.whatsapp,
      `Hi ${d.parent}, just a heads-up — ${d.firstName} has just been overtaken by ${overtakingContestantName} in The Future Star Contest. Rally more votes to help ${d.firstName} climb back up! Vote at ${process.env.NEXT_PUBLIC_APP_URL ?? "https://kidscrown.net"}`,
    ).catch(() => {});
  }
}

async function recordVote({
  contestantId,
  amountPaid,
  votesToAdd,
  voteMethod,
  stage,
  voterName,
  keepAnonymous,
  reference,
  requireVotingOpen = true,
  requirePaystackReference = true,
}: {
  contestantId: string;
  amountPaid: number;
  votesToAdd: number;
  voteMethod: "paystack" | "bank_tx";
  stage?: number;
  voterName?: string;
  keepAnonymous?: boolean;
  reference?: string;
  requireVotingOpen?: boolean;
  requirePaystackReference?: boolean;
}): Promise<VoteResult> {
  const config = await getContestConfig();
  if (requireVotingOpen && !config.votingOpen) {
    throw new VoteError("Voting is currently closed", 403);
  }

  const field = stageVoteField(stage ?? config.currentStage);

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        if (voteMethod === "paystack" && requirePaystackReference) {
          if (!reference) {
            throw new VoteError("Payment reference is required", 400);
          }

          const { count } = await tx.paystackTransaction.updateMany({
            where: { reference, status: "pending" },
            data: {
              status: "processed",
              processedAt: new Date(),
            },
          });

          if (count === 0) {
            return null;
          }
        }

        const current = await tx.contestant.findUnique({
          where: { contestantId, disabled: false },
          select: {
            stage1vote: true,
            stage2vote: true,
            stage3vote: true,
            firstName: true,
            lastName: true,
          },
        });

        if (!current) {
          throw new VoteError("Contestant not found", 404);
        }

        const currentVotes = current[field] ?? 0;
        const newVotes = currentVotes + votesToAdd;

        const contestant = await tx.contestant.update({
          where: { contestantId, disabled: false },
          data: {
            [field]: { increment: votesToAdd },
            voteLogs: {
              create: {
                voterName: voterName || "Anonymous",
                numberOfVotes: votesToAdd,
                amount: amountPaid,
                voteMethod,
                keepAnonymous: keepAnonymous ?? false,
              },
            },
          },
        });

        return {
          contestant,
          currentVotes,
          newVotes,
          overtakingContestantName: `${current.firstName} ${current.lastName}`,
        };
      },
      { timeout: 15000, maxWait: 10000 },
    );

    if (!result) {
      return { alreadyProcessed: true };
    }

    const displaced = await prisma.contestant.findMany({
      where: {
        [field]: { gt: result.currentVotes, lte: result.newVotes },
        disabled: false,
        contestantId: { not: contestantId },
      },
      select: { firstName: true, whatsapp: true, parent: true },
    });

    await notifyDisplacedContestants(displaced, result.overtakingContestantName);

    return { contestant: result.contestant };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { alreadyProcessed: true };
    }

    throw error;
  }
}

export async function recordVerifiedPaystackVote({
  reference,
  amountInKobo,
  customerEmail,
  currency,
  voterName,
  keepAnonymous,
}: VerifiedPaystackVote) {
  if (currency && currency !== "NGN") {
    throw new VoteError("Payment currency mismatch", 400);
  }

  const pending = await prisma.paystackTransaction.findUnique({
    where: { reference },
  });

  if (!pending) {
    throw new VoteError("Payment reference not initialized", 400);
  }

  if (pending.status === "processed") {
    return { alreadyProcessed: true } as const;
  }

  if (customerEmail?.toLowerCase() !== pending.expectedEmail.toLowerCase()) {
    throw new VoteError("Payment does not match contestant", 400);
  }

  const amountPaid = Math.floor(amountInKobo / 100);
  if (amountPaid !== pending.amount) {
    throw new VoteError("Payment amount mismatch", 400);
  }

  const votesToAdd = assertVotingAmount(amountPaid);
  if (votesToAdd !== pending.numberOfVotes) {
    throw new VoteError("Vote count mismatch", 400);
  }

  return recordVote({
    contestantId: pending.contestantId,
    amountPaid,
    votesToAdd,
    voteMethod: "paystack",
    stage: pending.stage,
    voterName: voterName ?? pending.voterName ?? undefined,
    keepAnonymous: keepAnonymous ?? pending.keepAnonymous,
    reference,
    requireVotingOpen: false,
  });
}

export async function recordBankTransferVote({
  contestantId,
  amount,
  voterName,
}: BankTransferVote) {
  if (!Number.isSafeInteger(amount) || amount < COST_PER_VOTE) {
    throw new VoteError("Invalid amount", 400);
  }

  return recordVote({
    contestantId,
    amountPaid: amount,
    votesToAdd: assertVotingAmount(amount),
    voteMethod: "bank_tx",
    voterName,
  });
}

export async function recordAdminVote({
  contestantId,
  amount,
  voterName,
  voteMethod,
}: AdminVote) {
  if (!Number.isSafeInteger(amount) || amount < COST_PER_VOTE) {
    throw new VoteError("Invalid amount", 400);
  }

  return recordVote({
    contestantId,
    amountPaid: amount,
    votesToAdd: assertVotingAmount(amount),
    voteMethod,
    voterName,
    requirePaystackReference: false,
  });
}
