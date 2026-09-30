"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

type PaywallModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlocked: () => void;
};

export function PaywallModal({
  open,
  onOpenChange,
  onUnlocked,
}: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMockUnlock() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/mock-unlock", { method: "POST" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Unlock failed");
      }
      onUnlocked();
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unlock failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRazorpayCheckout() {
    setLoading(true);
    setError(null);
    try {
      const orderRes = await fetch("/api/billing/create-order", {
        method: "POST",
      });
      if (!orderRes.ok) {
        const data = (await orderRes.json()) as { error?: string };
        throw new Error(data.error ?? "Could not start checkout");
      }
      const order = (await orderRes.json()) as {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };

      if (!window.Razorpay) {
        await loadRazorpayScript();
      }
      if (!window.Razorpay) {
        throw new Error("Razorpay failed to load");
      }

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay!({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          order_id: order.orderId,
          name: "Abhishek Swami",
          description: "1 hour portfolio agent access",
          handler: async () => {
            try {
              for (let i = 0; i < 10; i++) {
                await new Promise((r) => setTimeout(r, 1500));
                const statusRes = await fetch("/api/billing/status");
                const status = (await statusRes.json()) as { canSend?: boolean };
                if (status.canSend) {
                  onUnlocked();
                  onOpenChange(false);
                  resolve();
                  return;
                }
              }
              reject(new Error("Payment received; access pending. Refresh in a moment."));
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Checkout dismissed")),
          },
        });
        rzp.open();
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Free limit reached</DialogTitle>
          <DialogDescription>
            You&apos;ve used your 3 free questions. Unlock 1 hour for $0.50 to
            keep chatting with me.
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            className="w-full"
            disabled={loading}
            onClick={() => void handleRazorpayCheckout()}
          >
            {loading ? "Processing…" : "Pay with Razorpay"}
          </Button>
          {process.env.NEXT_PUBLIC_AGENT_BILLING_MOCK === "true" ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() => void handleMockUnlock()}
            >
              Dev: mock unlock
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay script error"));
    document.body.appendChild(script);
  });
}
