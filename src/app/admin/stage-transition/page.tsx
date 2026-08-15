"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Input } from "@ui/input";
import { Field, FieldLabel } from "@ui/field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";
import { Spinner } from "@ui/spinner";
import { STAGE_REQUIREMENTS } from "@/utils/vote-milestones";

type Config = {
  currentStage: number;
  stageLabel: string;
};

type PreviewResult = {
  passing: number;
  failing: number;
} | null;

export default function StageTransitionPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [threshold, setThreshold] = useState<number>(STAGE_REQUIREMENTS[1]);
  const [preview, setPreview] = useState<PreviewResult>(null);
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    fetch("/api/contest-config")
      .then((r) => r.json())
      .then((data) => setConfig(data));
  }, []);

  const runPreview = async () => {
    setPreviewing(true);
    const response = await fetch(
      `/api/admin/stage-transition/preview?threshold=${threshold}`
    );
    if (response.ok) {
      const data = await response.json();
      setPreview(data);
    }
    setPreviewing(false);
  };

  const runTransition = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/stage-transition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threshold, expectedStage: config?.currentStage }),
    });
    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      toast.success(
        `Stage advanced to ${data.newStage}. ${data.disabledCount} contestants eliminated. ${data.remaining} remaining.`
      );
      setConfig((c) => c && { ...c, currentStage: data.newStage });
      setPreview(null);
    } else {
      const err = await response.json().catch(() => ({}));
      toast.error(err.error ?? "Stage transition failed");
    }
  };

  if (!config) {
    return (
      <div className="fb-col-wrapper min-h-dvh grid place-items-center">
        <Spinner />
      </div>
    );
  }

  const atFinalStage = config.currentStage >= 3;

  return (
    <div className="fb-col-wrapper min-h-dvh grid place-items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Stage Transition</CardTitle>
          <CardDescription>
            Currently in <strong>{config.stageLabel}</strong> (Stage {config.currentStage})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {atFinalStage ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                The contest is already at the final stage. No further transitions available.
              </p>
            ) : (
              <>
                <Field>
                  <FieldLabel>Minimum votes to advance</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    value={threshold}
                    onChange={(e) => {
                      setThreshold(Number(e.target.value));
                      setPreview(null);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Contestants below this threshold will be eliminated.
                  </p>
                </Field>

                <Button
                  variant="outline"
                  onClick={runPreview}
                  disabled={previewing}>
                  {previewing && <Spinner />}
                  Preview Impact
                </Button>

                {preview && (
                  <div className="rounded-md border p-3 text-sm space-y-1">
                    <p>
                      <span className="font-bold text-green-600">{preview.passing}</span>{" "}
                      contestants would advance
                    </p>
                    <p>
                      <span className="font-bold text-red-600">{preview.failing}</span>{" "}
                      contestants would be eliminated
                    </p>
                  </div>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Advance to Stage {config.currentStage + 1}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Stage Transition</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will eliminate all contestants with fewer than{" "}
                        <strong>{threshold} votes</strong> and advance the contest to
                        Stage {config.currentStage + 1}. Voting will be paused.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={runTransition} disabled={loading}>
                        {loading && <Spinner />}
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
