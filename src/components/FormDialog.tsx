// components/ui/large-dialog.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LargeDialogProps {
  title?: string;
  trigger: ReactNode;
  onInsert?: () => void;
  onCancel?: () => void;
  children: ReactNode;
}

export default function FormDialog({
  title = "Insert Data to Chatbot",
  trigger,
  onInsert,
  onCancel,
  children,
}: LargeDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-xl font-bold text-gray-900">
              {title}
            </Dialog.Title>
            <div className="flex gap-2">
              <Dialog.Close asChild>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={onInsert}>Insert</Button>
            </div>
          </div>

          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
