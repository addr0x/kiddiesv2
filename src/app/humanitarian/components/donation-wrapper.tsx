"use client";

import dynamic from "next/dynamic";

const DonationButton = dynamic(() => import("./donation-button"), {
  ssr: false,
});

export default function DonationWrapper() {
  return <DonationButton />;
}
