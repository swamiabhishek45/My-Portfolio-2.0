"use client";

import { Mail, Linkedin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { careerData } from "@/data/career";
import { overviewData } from "@/data/overview";

export type AgentLimitKind = "text" | "voice";

type AgentLimitModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: AgentLimitKind;
};

const mailtoHire = `mailto:${overviewData.email}?subject=${encodeURIComponent(
  "Portfolio chat — let's connect"
)}&body=${encodeURIComponent(
  "Hi Abhishek,\n\nI tried the portfolio agent and would like to continue the conversation.\n\n"
)}`;

export function AgentLimitModal({
  open,
  onOpenChange,
  kind,
}: AgentLimitModalProps) {
  const isVoice = kind === "voice";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isVoice ? "Voice limit reached" : "Message limit reached"}
          </DialogTitle>
          <DialogDescription>
            {isVoice
              ? "You've used your 3 free voice messages on this demo. Text chat may still be available, or reach out directly to keep talking."
              : "You've used your 10 free text messages on this demo. For hiring or longer conversations, email or connect on LinkedIn."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button type="button" className="w-full gap-2" asChild>
            <a href={mailtoHire}>
              <Mail className="size-4" />
              Email me
            </a>
          </Button>
          <Button type="button" variant="outline" className="w-full gap-2" asChild>
            <a
              href={careerData.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="size-4" />
              LinkedIn
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
