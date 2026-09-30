"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { AgentPanel } from "@/components/agent/agent-panel";
import { Button } from "@/components/ui/button";

export function AgentFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="icon-lg"
        className="fixed bottom-5 right-5 z-50 size-14 rounded-full shadow-lg"
        aria-label="Open chat with Abhishek"
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="size-6" />
      </Button>
      <AgentPanel open={open} onOpenChange={setOpen} />
    </>
  );
}
