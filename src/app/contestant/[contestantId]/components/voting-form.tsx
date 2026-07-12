"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Input } from "@ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Checkbox } from "@ui/checkbox";
import BankTransferInstructions from "./bank-transfer-intructions";
import { VOTE_BUNDLES } from "@/lib/vote-bundles";

const PaystackPaymentProcessing = dynamic(() => import("./paystack"), {
  ssr: false,
});

type Props = {
  updateSuccessDialogData: (numberOfVotes: string) => void;
  isVotingOpen: boolean;
  triggerOpen?: boolean;
  onTriggerConsumed?: () => void;
  contestant: {
    contestantId: string;
    name: string;
    gender: string;
    stage2votes: number;
  };
};

interface IFormInput {
  voterName: string;
  numberOfVotes: string;
  keepAnonymous?: boolean;
  votingMethod: "paystack" | "bankTransfer";
}

export default function VotingForm({
  contestant,
  updateSuccessDialogData,
  isVotingOpen,
  triggerOpen,
  onTriggerConsumed,
}: Props) {
  const { contestantId, name } = contestant;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<IFormInput>();

  // eslint-disable-next-line react-hooks/incompatible-library
  const isPaystackSelected = watch("votingMethod") === "paystack";
  const numberOfVotes = watch("numberOfVotes");

  const paymentData = {
    contestantId: contestant.contestantId,
    voteData: {
      voterName: watch("voterName"),
      keepAnonymous: watch("keepAnonymous") ?? null,
      numberOfVotes,
    },
  };

  const [activeDialog, setActiveDialog] = useState<"none" | "first" | "second">(
    "none",
  );

  const closeAllDialog = () => setActiveDialog("none");

  useEffect(() => {
    if (triggerOpen) {
      setActiveDialog("first");
      onTriggerConsumed?.();
    }
  }, [onTriggerConsumed, triggerOpen]);

  const onSubmit: SubmitHandler<IFormInput> = async () => {};

  return (
    <>
      {/* FIRST DIALOG – VOTE FORM */}
      <Dialog
        open={activeDialog === "first"}
        onOpenChange={(open) => setActiveDialog(open ? "first" : "none")}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="h-12 px-8 font-bold rounded-xl bg-[#FACC14] text-black border-2 border-black shadow-[4px_4px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition grow focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
            onClick={() => setActiveDialog("first")}>
            VOTE NOW
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-106.25 border-2 border-black shadow-[6px_6px_0px_#111] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-bold text-black text-xl">
              Vote for <span className="text-black">{name}</span>
            </DialogTitle>
            <DialogDescription>
              Help <span className="font-bold">{contestant.name}</span> get{" "}
              <span className="font-bold">more votes</span> to win the contest.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5">
              {/* VOTER NAME */}
              <Field className="grid gap-2">
                <FieldLabel
                  htmlFor="voterName"
                  className="font-bold text-black">
                  What&apos;s your name
                </FieldLabel>
                <Input
                  {...register("voterName", {
                    required: "Your name is required",
                    maxLength: 50,
                  })}
                  className="border-2 border-black rounded-xl"
                  placeholder="Adeola Chisom"
                />
                <FieldError>{errors.voterName?.message}</FieldError>
              </Field>

              {/* VOTE BUNDLES */}
              <Field className="grid gap-2">
                <FieldLabel className="font-bold text-black">
                  Choose a vote pack{" "}
                  <span className="text-gray-500 font-semibold">
                    (₦50/vote)
                  </span>
                </FieldLabel>

{!isVotingOpen ? (
                    <p className="text-sm font-semibold text-gray-500 border-2 border-black rounded-xl px-3 py-2 bg-gray-50">
                      Voting is currently closed
                    </p>
                  ) : (
                    <Controller
                      name="numberOfVotes"
                      control={control}
                      rules={{ required: "Please select a vote pack" }}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          {VOTE_BUNDLES.map((bundle) => {
                            const selected = field.value === String(bundle.votes);
                            return (
                              <button
                                key={bundle.votes}
                                type="button"
                                onClick={() =>
                                  field.onChange(String(bundle.votes))
                                }
                                className={`relative rounded-xl border-2 p-2 text-left transition-all ${
                                  selected
                                    ? "border-black bg-[#FACC14] shadow-[3px_3px_0px_#111]"
                                    : "border-black/20 hover:border-black bg-white"
                                } ${bundle.highlight ? "ring-2 ring-[#FACC14] ring-offset-1" : ""}`}>
                                {bundle.highlight && (
                                  <span className="absolute -top-2 right-2 text-[10px] font-bold bg-[#FACC14] text-black px-2 py-0.5 rounded-full border border-[#FACC14]">
                                    Popular
                                  </span>
                                )}
                                <p className="text-lg font-black text-black">
                                  {bundle.votes} votes
                                </p>
                                <p className="text-xs text-gray-500 font-semibold">
                                  ₦{bundle.price.toLocaleString()}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    />
                  )}
                <FieldError>{errors.numberOfVotes?.message}</FieldError>
              </Field>

              {/* WHY YOU PAY */}
              <div className="rounded-xl border-2 border-black/20 bg-black/5 px-3 py-2">
                <p className="text-xs font-semibold text-gray-600 leading-relaxed">
                  Your ₦50 per vote funds our humanitarian outreach to IDP camps across
                  Nigeria — food, school supplies, and medical aid for children and
                  families.{" "}
                  <a
                    href="/humanitarian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold hover:text-black transition-colors">
                    Learn more →
                  </a>
                </p>
              </div>

              {/* VOTING METHOD */}
              <Field>
                <FieldLabel
                  htmlFor="votingMethod"
                  className="font-bold text-black">
                  Select voting method
                </FieldLabel>
                <Controller
                  name="votingMethod"
                  control={control}
                  rules={{ required: "Voting method is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="border-2 border-black rounded-xl">
                        <SelectValue placeholder="Voting method" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-black">
                        <SelectItem value="paystack">Paystack</SelectItem>
                        <SelectItem value="bankTransfer">
                          Bank Transfer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.votingMethod?.message}</FieldError>
              </Field>

              {/* ANONYMOUS CHECKBOX */}
              {isPaystackSelected && (
                <Controller
                  control={control}
                  name="keepAnonymous"
                  render={({ field }) => (
                    <div className="flex space-x-3 items-start">
                      <Checkbox
                        id="keepAnonymous"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-2 border-black"
                      />
                      <div className="grid gap-1">
                        <FieldLabel
                          htmlFor="keepAnonymous"
                          className="font-bold text-black">
                          Keep my vote anonymous
                        </FieldLabel>
                        <p className="text-gray-500 text-xs font-semibold">
                          This will hide your name on the contestant&apos;s vote
                          records
                        </p>
                      </div>
                    </div>
                  )}
                />
              )}

              {/* TRUST SIGNAL */}
              {isPaystackSelected && (
                <div className="flex items-center gap-2 rounded-xl bg-[#22C55E]/10 border-2 border-[#22C55E] px-3 py-2 text-xs font-semibold text-green-800">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 shrink-0 text-green-600 fill-current">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z" />
                  </svg>
                  <span>
                    Secured by <strong>Paystack</strong> — votes credited
                    instantly after payment
                  </span>
                </div>
              )}

              {/* FOOTER BUTTONS */}
              <div className="flex gap-3 justify-end">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="border-2 border-black rounded-xl font-bold">
                    Cancel
                  </Button>
                </DialogClose>

                {isPaystackSelected ? (
                  <PaystackPaymentProcessing
                    isFormValid={isValid}
                    closeAllDialog={closeAllDialog}
                    paymentData={paymentData}
                    updateSuccessDialogData={updateSuccessDialogData}
                  />
                ) : (
                  <Button
                    type="button"
                    className="bg-black text-[#FACC14] font-bold rounded-xl border-2 border-black"
                    onClick={handleSubmit(() => setActiveDialog("second"))}>
                    Continue
                  </Button>
                )}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* SECOND DIALOG – BANK TRANSFER */}
      <Dialog
        open={activeDialog === "second"}
        onOpenChange={(open) => setActiveDialog(open ? "second" : "none")}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col border-2 border-black shadow-[6px_6px_0px_#111]">
          <DialogHeader>
            <DialogTitle className="font-bold text-black">
              Bank Transfer Instructions
            </DialogTitle>
          </DialogHeader>

          <BankTransferInstructions
            contestantName={name}
            contestantId={contestantId}
            numberOfVotes={Number(numberOfVotes || 0)}
          />

          <div className="flex justify-end mt-6">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-2 border-black rounded-xl font-bold">
                Okay
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
