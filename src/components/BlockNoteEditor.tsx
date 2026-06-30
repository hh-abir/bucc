"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";

interface BlockNoteEditorProps {
  initialValue?: any;
  onChange: (content: any) => void;
}

export default function BlockNoteEditor({ initialValue, onChange }: BlockNoteEditorProps) {
  const { resolvedTheme } = useTheme();

  // Initialize the editor
  const editor = useCreateBlockNote({
    initialContent: initialValue && initialValue.length > 0 ? initialValue : undefined,
  });

  return (
    <div className="min-h-[500px] border border-border rounded-md bg-background overflow-hidden py-4">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={() => {
          onChange(editor.document);
        }}
      />
    </div>
  );
}
