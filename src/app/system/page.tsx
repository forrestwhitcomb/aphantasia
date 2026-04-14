"use client";

import { EditorProvider } from "@/system/store";
import { Editor } from "@/system/Editor";

export default function SystemPage() {
  return (
    <EditorProvider>
      <Editor />
    </EditorProvider>
  );
}
