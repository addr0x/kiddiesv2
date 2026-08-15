"use client";

import Image from "next/image";
import VotingForm from "./voting-form";
import PastVotes from "./past-votes";
import { capitalize } from "@/utils/capitalize";
import { contestantImageSrc } from "@/utils/contestant-image";
import { nthPosition } from "@/utils/format-position";
import {
  getEarnedMilestones,
  getNextMilestone,
  MILESTONES,
  STAGE_REQUIREMENTS,
} from "@/utils/vote-milestones";
import { useEffect, useRef, useState } from "react";
import { ShowVoteSuccess } from "./voting-success";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { Sparkles } from "lucide-react";

type contestantProps = {
  contestant: {
    contestantId: string;
    name: string;
    bio: string;
    gender: string;
    age: string;
    stage1vote: number;
    stage2vote: number;
    stage3vote: number;
    currentVotes: number;
    currentStage: number;
    stageLabel: string;
    position: number;
    picture: string;
    videoUrl?: string | null;
    voteDifference: number;
    voteLogs: {
      id: string;
      voterName: string;
      amount: number;
      numberOfVotes: number;
      voteMethod: string;
      createdAt: string;
      keepAnonymous: boolean | null;
    }[];
    appUrl?: string;
  };
  isVotingOpen: boolean;
};

function ageSpotlight(name: string, age: string) {
  const ageNumber = Number(age);

  if (Number.isNaN(ageNumber)) {
    return `Meet ${name}, a joyful young contestant with charm, confidence, and a beautiful spirit.`;
  }

  if (ageNumber === 0) {
    return `${name} is already winning hearts with every smile, bringing pure joy and sweetness to the Future Star stage.`;
  }

  if (ageNumber <= 3) {
    return `${name} is a cheerful little explorer with a bright smile, big personality, and plenty of sparkle.`;
  }

  if (ageNumber <= 7) {
    return `${name} is a confident young star with energy, charm, and a beautiful spirit ready to shine.`;
  }

  return `${name} is a bold and inspiring contestant with star quality, confidence, and a stage-ready spirit.`;
}

export default function Profile({ contestant, isVotingOpen }: contestantProps) {
  const router = useRouter();
  const currentVotes = contestant.currentVotes ?? contestant.stage2vote ?? 0;
  const requiredVotes = STAGE_REQUIREMENTS[contestant.currentStage] ?? null;
  const requiredMilestone = requiredVotes
    ? MILESTONES.find((milestone) => milestone.votes === requiredVotes)
    : null;
  const votesNeeded = requiredVotes
    ? Math.max(0, requiredVotes - currentVotes)
    : 0;
  const [successDialog, setSuccessDialog] = useState<boolean>(false);
  const [successDialogData, setSuccessDialogData] = useState<{
    vote: string;
  }>();
  const [displayedVotes, setDisplayedVotes] = useState(currentVotes);
  const [triggerVoteForm, setTriggerVoteForm] = useState(false);
  const [showRequiredVotesPrompt, setShowRequiredVotesPrompt] = useState(
    votesNeeded > 0,
  );
  const displayedVotesRef = useRef(currentVotes);
  const animationFrameRef = useRef<number | null>(null);

  const animateVotesTo = (nextVotes: number) =>
    new Promise<void>((resolve) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startVotes = displayedVotesRef.current;
    const voteDelta = nextVotes - startVotes;
    const startedAt = performance.now();
    const duration = 900;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextDisplayedVotes = Math.round(
        startVotes + voteDelta * easedProgress,
      );

      displayedVotesRef.current = nextDisplayedVotes;
      setDisplayedVotes(nextDisplayedVotes);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        animationFrameRef.current = null;
        resolve();
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  });

  const updateSuccessDialogData = async (numberOfVotes: string) => {
    const addedVotes = Number(numberOfVotes);
    if (Number.isSafeInteger(addedVotes) && addedVotes > 0) {
      await animateVotesTo(displayedVotesRef.current + addedVotes);
    }

    setSuccessDialogData({ vote: numberOfVotes });
    setSuccessDialog(true);
  };

  const refreshPage = () => {
    setSuccessDialog(false);
    router.refresh();
  };

  const srcImage = contestantImageSrc(
    contestant.picture,
    contestant.gender,
  );
  const bio =
    contestant.bio?.trim() || ageSpotlight(contestant.name, contestant.age);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <ShowVoteSuccess
        open={successDialog}
        refreshPage={refreshPage}
        vote={successDialogData?.vote || "0"}
        totalVotes={displayedVotes}
        contestantName={contestant.name}
      />
      <Dialog
        open={showRequiredVotesPrompt}
        onOpenChange={setShowRequiredVotesPrompt}>
        <DialogContent className="border-2 border-black bg-white text-center shadow-[6px_6px_0px_#111] sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="grid size-14 place-items-center rounded-2xl border-2 border-black bg-[#FACC14] text-black shadow-[3px_3px_0px_#111]">
              <Sparkles className="size-7" />
            </div>
            <DialogTitle className="text-2xl font-black text-black">
              {contestant.name} needs your support
            </DialogTitle>
            <DialogDescription className="text-sm font-semibold leading-relaxed text-gray-600">
              {contestant.name} currently has{" "}
              <span className="font-black text-black">{currentVotes}</span>{" "}
              {currentVotes === 1 ? "vote" : "votes"}. Help reach{" "}
              <span className="font-black text-black">
                {requiredVotes} votes
              </span>{" "}
              to meet the {contestant.stageLabel} requirement
              {requiredMilestone ? ` and unlock ${requiredMilestone.label}` : ""}
              .
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl border-2 border-black bg-sky-50 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-wider text-sky-600">
              Votes needed
            </p>
            <p className="text-4xl font-black leading-none text-black">
              {votesNeeded}
            </p>
          </div>

          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <button className="rounded-xl border-2 border-black bg-white px-5 py-3 text-sm font-bold text-black shadow-[3px_3px_0px_#111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                Maybe later
              </button>
            </DialogClose>
            {isVotingOpen && (
              <button
                className="rounded-xl border-2 border-black bg-[#FACC14] px-5 py-3 text-sm font-bold text-black shadow-[3px_3px_0px_#111] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                onClick={() => {
                  setShowRequiredVotesPrompt(false);
                  setTriggerVoteForm(true);
                }}
              >
                Vote now
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile photo */}
      <div className="full-bleed max-h-96 md:max-h-120 overflow-hidden md:rounded-2xl md:border-2 md:border-black md:shadow-[6px_6px_0px_#111] md:col-start-2 md:col-span-6">
        <Image
          alt="Profile picture"
          src={srcImage}
          width={360}
          height={460}
          priority
          className="min-w-full object-cover"
        />
      </div>

      {/* Info column */}
      <div className="md:col-start-8 md:col-span-6 space-y-6">
        <div>
          <span className="inline-block bg-black text-[#FACC14] font-bold text-[0.65rem] px-3 py-1 rounded-full mb-2 tracking-wide">
            Contestant #{contestant.contestantId}
          </span>
          <h1 className="font-bold text-black text-3xl md:text-4xl leading-tight">
            {contestant.name}
          </h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="bg-black text-[#FACC14] font-bold text-xs px-3 py-1 rounded-full border-2 border-black">
              {capitalize(contestant.gender)}
            </span>
            <span className="bg-[#22C55E] text-white font-bold text-xs px-3 py-1 rounded-full border-2 border-[#22C55E]">
              Age {contestant.age}
            </span>
          </div>
          <div className="mt-4 border-l-4 border-[#FACC14] pl-4 text-left">
            <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>
            <p className="mt-3 text-xs font-semibold text-gray-500">
              Every vote helps {contestant.name} shine brighter and move closer
              to the crown.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Vote count + position */}
          <div className="flex gap-4">
            <div className="flex-1 bg-sky-100 border border-sky-200 rounded-2xl p-4 text-center">
              <p className="text-sky-500 font-bold text-xs uppercase tracking-wider">
                {contestant.stageLabel ?? "Votes"}
              </p>
              <p className="text-sky-900 font-black text-3xl leading-tight">
                {displayedVotes.toLocaleString()}{" "}
                <span className="text-lg font-bold">votes</span>
              </p>
            </div>
            <div className="flex-1 bg-sky-100 border border-sky-200 rounded-2xl p-4 text-center">
              <p className="text-sky-500 font-bold text-xs uppercase tracking-wider">
                Position
              </p>
              <p className="text-sky-900 font-black text-3xl leading-tight">
                {contestant.position <= 20
                  ? nthPosition(contestant.position)
                  : "–"}
              </p>
            </div>
          </div>

          {/* Milestone badges */}
          {(() => {
            const votes = displayedVotes;
            const earned = getEarnedMilestones(votes);
            const next = getNextMilestone(votes);
            if (earned.length === 0 && !next) return null;
            return (
              <div className="space-y-2">
                {earned.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {earned.map((m) => (
                      <span
                        key={m.votes}
                        className={`inline-flex items-center gap-1 text-xs font-bold border rounded-full px-3 py-1 ${m.color}`}>
                        {m.emoji} {m.label}
                      </span>
                    ))}
                  </div>
                )}
                {next && (
                  <p className="text-xs text-gray-500 font-semibold">
                    Next badge:{" "}
                    <span className="font-bold text-black">
                      {next.emoji} {next.label}
                    </span>{" "}
                    at {next.votes} votes —{" "}
                    <span className="font-bold text-black">
                      {next.votes - votes} more
                    </span>{" "}
                    to go!
                  </p>
                )}
              </div>
            );
          })()}

          {/* Progress toward next rank */}
          {contestant.position === 1 && contestant.voteDifference === null ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
              <p className="font-bold text-amber-700 text-sm">
                🏆 Leading the contest right now!
              </p>
            </div>
          ) : contestant.voteDifference !== null &&
            contestant.voteDifference > 0 &&
            displayedVotes > 1 &&
            contestant.position - 1 <= 20 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>
                  Progress to {nthPosition(contestant.position - 1)} place
                </span>
                <span>{contestant.voteDifference} votes needed</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-400 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      95,
                      (displayedVotes /
                        (displayedVotes + contestant.voteDifference)) *
                        100,
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 font-semibold">
                Only{" "}
                <span className="font-bold text-black">
                  {contestant.voteDifference} more votes
                </span>{" "}
                to reach{" "}
                <span className="font-bold text-black">
                  {nthPosition(contestant.position - 1)} place
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 font-semibold">
              Keep voting to help {contestant.name} climb the ranks!
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <PastVotes voteLog={contestant.voteLogs} />
          <VotingForm
            updateSuccessDialogData={updateSuccessDialogData}
            isVotingOpen={isVotingOpen}
            triggerOpen={triggerVoteForm}
            onTriggerConsumed={() => setTriggerVoteForm(false)}
            contestant={{
              contestantId: contestant.contestantId,
              name: contestant.name,
              gender: contestant.gender,
              stage2votes: contestant.stage2vote,
            }}
          />
        </div>

        {contestant.videoUrl &&
          (() => {
            const youtubeMatch = contestant.videoUrl!.match(
              /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
            );
            if (youtubeMatch) {
              return (
                <div className="mt-4 rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_#111] aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                    title={`${contestant.name} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              );
            }
            return (
              <a
                href={contestant.videoUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-bold text-sm underline underline-offset-4 text-[#FACC14] hover:opacity-70 transition">
                Watch {contestant.name}&apos;s video →
              </a>
            );
          })()}
      </div>
    </>
  );
}
