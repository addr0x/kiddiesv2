"use client";

import { usePaystackPayment } from "react-paystack";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@ui/dialog";
import { Input } from "@ui/input";
import { Label } from "@ui/label";

import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DonationButton() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [initializing, setInitializing] = useState(false);

  const [paymentConfig, setPaymentConfig] = useState({
    reference: "",
    email: "",
    amount: 0,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
  });

  const initializePayment = usePaystackPayment(paymentConfig);

  const onSuccess = async (transaction: { reference: string }) => {
    const response = await fetch("/api/donation/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: transaction.reference }),
    });

    if (response.ok) {
      toast.success("Thank you for your generous donation!");
      setOpen(false);
    } else {
      const err = await response.json().catch(() => ({}));
      toast.error(err.error ?? "Donation could not be verified. Contact support.");
    }
  };

  const onClose = () => {};

  const onSubmit = async () => {
    const amountNum = Number(amount);
    if (!amountNum || amountNum < 500) {
      toast.error("Minimum donation is ₦500");
      return;
    }

    setInitializing(true);
    try {
      const response = await fetch("/api/donation/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountNum,
          donorName,
          email,
          phone,
          message,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error ?? "Could not initialize payment.");
        return;
      }

      const nextConfig = await response.json();
      setPaymentConfig(nextConfig);
      setOpen(false);
      initializePayment({
        config: nextConfig,
        onSuccess,
        onClose,
      });
    } catch {
      toast.error("Could not initialize payment.");
    } finally {
      setInitializing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-sm px-7 py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition cursor-pointer">
          <Heart size={16} />
          Donate / Support
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="font-bold text-xl text-center">
          Make a Donation
        </DialogTitle>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="donation-amount">Amount (₦) *</Label>
            <Input
              id="donation-amount"
              type="number"
              min={500}
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-gray-500">Minimum donation is ₦500</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="donor-name">Your Name (optional)</Label>
            <Input
              id="donor-name"
              placeholder="John Doe"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donor-email">Email (optional)</Label>
            <Input
              id="donor-email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donor-phone">Phone (optional)</Label>
            <Input
              id="donor-phone"
              type="tel"
              placeholder="+234 800 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donor-message">Message (optional)</Label>
            <textarea
              id="donor-message"
              placeholder="A word of encouragement..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button
            onClick={onSubmit}
            disabled={initializing}
            className="w-full bg-[#FACC14] text-black font-bold hover:bg-[#EAB308] border-2 border-black shadow-[3px_3px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition cursor-pointer px-7 py-3 rounded-full">
            {initializing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Initializing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Heart size={16} />
                Donate Now
              </span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
