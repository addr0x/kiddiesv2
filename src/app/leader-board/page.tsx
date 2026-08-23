import { prisma } from "@/lib/prisma";
import { getContestConfig, stageVoteField } from "@/lib/contest-config";
import { ArrowLeft, Clock3 } from "lucide-react";
import Link from "next/link";
import LeaderboardClient, { LeaderboardContestant } from "./leaderboard-client";

const SHOW_COMING_SHORTLY = true;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://kidscrown.net";

export const dynamic = "force-dynamic";

function LeaderBoardComingShortly() {
  return (
    <section className="fb-col-wrapper flex min-h-[calc(100vh-7rem)] items-center justify-center pt-20 pb-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl border-2 border-black bg-black text-[#FACC14] shadow-[4px_4px_0px_#FACC14]">
          <Clock3 className="size-8" />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#FACC14] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black">
          Contest Update
        </span>
        <h2 className="mx-auto mt-4 max-w-xl font-bold text-black text-[clamp(2rem,4vw,3.25rem)] leading-tight">
          The Final Will Resume Shortly
        </h2>
        <p className="mt-3 text-base font-semibold leading-relaxed text-gray-600">
          We&apos;ll be back soon. Thank you for your patience.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-5 py-3 text-sm font-bold text-black shadow-[3px_3px_0px_#111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
            <ArrowLeft className="size-4" />
            Back Home
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center rounded-xl border-2 border-black bg-[#FACC14] px-5 py-3 text-sm font-bold text-black shadow-[3px_3px_0px_#111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
            Register
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function LeaderBoardPage() {
  if (SHOW_COMING_SHORTLY) {
    return <LeaderBoardComingShortly />;
  }

  const config = await getContestConfig();
  const field = stageVoteField(config.currentStage);
  const rawContestants = await prisma.contestant.findMany({
    where: { disabled: false },
    select: {
      contestantId: true,
      firstName: true,
      lastName: true,
      stage1vote: true,
      stage2vote: true,
      stage3vote: true,
      gender: true,
      age: true,
      picture: true,
    },
    orderBy: { [field]: "desc" },
    take: 5,
  });
  const topContestants: LeaderboardContestant[] = rawContestants.map(
    (contestant) => ({
      contestantId: contestant.contestantId,
      firstName: contestant.firstName,
      lastName: contestant.lastName,
      gender: contestant.gender,
      picture: contestant.picture,
      currentVotes: contestant[field],
    }),
  );

  return (
    <section className="fb-col-wrapper pt-20 pb-16">
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-xs px-4 py-1.5 rounded-full border-2 border-black tracking-wider uppercase">
          Rankings
        </span>
        <div>
          <h2 className="font-bold text-black text-[clamp(1.8rem,4vw,3rem)] flex items-center justify-center gap-3">
            <span>Leader Board</span>
          </h2>
          <p className="text-gray-600 font-semibold text-sm">
            The best performing contestants
          </p>
        </div>
      </div>

      <div className="mt-8">
        <LeaderboardClient appUrl={APP_URL} initial={topContestants} />
      </div>
    </section>
  );
}
