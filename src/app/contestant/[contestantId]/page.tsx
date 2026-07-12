import { cache } from "react";
import Countdown from "./components/countdown";
import HowToVote from "./components/how-to-vote";
import NoUserFound from "./components/not-found";
import Profile from "./components/profile";
import { ShareLink } from "./components/share";
import { prisma } from "@/lib/prisma";
import { getContestConfig, stageVoteField } from "@/lib/contest-config";
import { capitalize } from "@/utils/capitalize";
import { redactAnonymousVoteLog } from "@/lib/vote-log-privacy";
import type { Metadata } from "next";

interface ContestantPageParams {
  params: Promise<{ contestantId: string }>;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.leadritehub.com";

const fetchContestant = cache(async function fetchContestant(contestantId: string) {
  const [contestant, config] = await Promise.all([
    prisma.contestant.findUnique({
      where: { contestantId, disabled: false },
      select: {
        contestantId: true,
        firstName: true,
        lastName: true,
        stage1vote: true,
        stage2vote: true,
        stage3vote: true,
        gender: true,
        age: true,
        bio: true,
        picture: true,
        videoUrl: true,
        disabled: true,
        voteLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            voterName: true,
            amount: true,
            numberOfVotes: true,
            voteMethod: true,
            createdAt: true,
            keepAnonymous: true,
          },
        },
      },
    }),
    getContestConfig(),
  ]);

  if (!contestant) return null;

  const field = stageVoteField(config.currentStage);
  const contestantCurrentVotes = contestant[field] ?? 0;

  const [positionResult, preceding] = await Promise.all([
    prisma.contestant.count({
      where: { [field]: { gt: contestantCurrentVotes }, disabled: false },
    }),
    prisma.contestant.findFirst({
      where: { [field]: { gt: contestantCurrentVotes }, disabled: false },
      orderBy: { [field]: "asc" },
      select: { stage1vote: true, stage2vote: true, stage3vote: true },
    }),
  ]);

  const position = positionResult + 1;
  const precedingVotes = preceding ? preceding[field] : null;
  const voteDifference =
    precedingVotes !== null ? precedingVotes - contestantCurrentVotes : null;

  return {
    ...contestant,
    currentVotes: contestantCurrentVotes,
    currentStage: config.currentStage,
    stageLabel: config.stageLabel,
    votingOpen: config.votingOpen,
    endDate: config.endDate?.toISOString() ?? null,
    position,
    voteDifference,
  };
});

export async function generateMetadata({
  params,
}: ContestantPageParams): Promise<Metadata> {
  const { contestantId } = await params;
  const user = await fetchContestant(contestantId);

  if (!user) {
    return { title: "Contestant Not Found | The Future Star Contest" };
  }

  const name = [user.firstName, user.lastName]
    .filter(Boolean)
    .map(capitalize)
    .join(" ");
  const votes = user.currentVotes ?? user.stage2vote ?? 0;
  const pronoun = user.gender === "male" ? "him" : "her";
  const title = `Help ${name} win The Future Star Contest`;
  const description = `${name} has ${votes} votes. Help ${pronoun} win by voting today. Every vote counts.`;
  const pageUrl = `${APP_URL}/contestant/${contestantId}`;
  const imageUrl = `${pageUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "The Future Star Contest",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Contestant({ params }: ContestantPageParams) {
  const { contestantId } = await params;

  const user = await fetchContestant(contestantId);

  if (!user) {
    return <NoUserFound />;
  }

  const contestant = {
    ...user,
    bio: user.bio ?? "",
    picture: user.picture ?? "",
    voteDifference: user.voteDifference ?? 0,
    voteLogs: user.voteLogs.map((vote) =>
      redactAnonymousVoteLog({
        ...vote,
        createdAt: vote.createdAt.toISOString(),
      }),
    ),
    appUrl: APP_URL,
    name: [user.firstName, user.lastName]
      .filter(Boolean)
      .map(capitalize)
      .join(" "),
  };

  const countdownTarget = user.endDate
    ? new Date(user.endDate).toISOString().split("T")[0]
    : "";
  const countdownHeader = user.stageLabel
    ? `${user.stageLabel} Ends in`
    : "Contest Ends in";

  return (
    <section className="fb-col-wrapper pt-20 md:pt-32">
      {/* {user.currentStage === 2 && !user.votingOpen && <StageTwoComingSoon />} */}
      {countdownTarget && (
        <Countdown target={countdownTarget} header={countdownHeader} />
      )}
      <Profile
        contestant={contestant}
        isVotingOpen={user.votingOpen ?? false}
      />
      <ShareLink contestantName={contestant.name} />
      <HowToVote />
    </section>
  );
}
