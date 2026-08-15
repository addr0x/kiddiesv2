export type Milestone = {
  votes: number;
  label: string;
  emoji: string;
  color: string; // Tailwind bg class
};

export const STAGE_REQUIREMENTS: Record<number, number> = {
  1: 200,
};

export const MILESTONES: Milestone[] = [
  { votes: 10,   label: "First Steps",   emoji: "👶", color: "bg-gray-100 text-gray-600 border-gray-300" },
  { votes: 50,   label: "Rising Star",   emoji: "⭐", color: "bg-yellow-50 text-yellow-700 border-yellow-300" },
  { votes: 100,  label: "Fan Favorite",  emoji: "❤️", color: "bg-pink-50 text-pink-700 border-pink-300" },
  { votes: STAGE_REQUIREMENTS[1], label: "Qualifier", emoji: "🏅", color: "bg-blue-50 text-blue-700 border-blue-300" },
  { votes: 500,  label: "Champion",      emoji: "🏆", color: "bg-amber-50 text-amber-700 border-amber-300" },
  { votes: 1000, label: "Legend",        emoji: "👑", color: "bg-teal-50 text-teal-700 border-teal-400" },
];

export function getEarnedMilestones(votes: number): Milestone[] {
  return MILESTONES.filter((m) => votes >= m.votes);
}

export function getNextMilestone(votes: number): Milestone | null {
  return MILESTONES.find((m) => votes < m.votes) ?? null;
}
