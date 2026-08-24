import { getContestConfig, stageVoteField } from "@/lib/contest-config";
import { prisma } from "@/lib/prisma";
import LeaderboardClient, {
  LeaderboardContestant,
} from "../leader-board/leaderboard-client";

export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://kidscrown.net";

export default async function LeaderboardPage() {
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

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          className="rounded-xl border-2 border-black bg-[#FACC14] px-6 py-3 text-sm font-bold text-black shadow-[3px_3px_0px_#111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
          Next →
        </button>
      </div>
    </section>
  );
}
