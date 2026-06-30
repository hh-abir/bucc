"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";

interface BlockNoteRendererProps {
  initialValue: string; // JSON string
}

export default function BlockNoteRenderer({ initialValue }: BlockNoteRendererProps) {
  const { resolvedTheme } = useTheme();

  let content = undefined;
  try {
    content = JSON.parse(initialValue);
  } catch (e) {
    console.error("Failed to parse BlockNote content", e);
  }

  const editor = useCreateBlockNote({
    initialContent: content,
  });

  return (
    <div className="prose-container">
      <BlockNoteView
        editor={editor}
        editable={false}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
}
