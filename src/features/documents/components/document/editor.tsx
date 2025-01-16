"use client";

import { useThreads } from "@liveblocks/react/suspense";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode } from "@lexical/rich-text";
import {
  FloatingComposer,
  FloatingThreads,
  liveblocksConfig,
  LiveblocksPlugin,
} from "@liveblocks/react-lexical";

import Toolbar from "@/features/documents/components/document/toolbar";
import Threads from "@/features/documents/components/document/threads";
import FloatingToolbar from "@/features/documents/components/document/floating-toolbar";
import Comments from "@/features/documents/components/document/comments";
import LEXICAL_THEME from "@/features/documents/core/configs";
import type { TUser } from "@/features/documents/core/types";
import Navbar from "./navbar";

interface IEditorProps {
  documentId: string;
  documentTitle: string;
  userAccessType: "viewer" | "editor";
  documentUsers: TUser[];
  creatorId: string;
}

const Editor = ({
  userAccessType,
  documentId,
  documentTitle,
  documentUsers,
  creatorId,
}: IEditorProps) => {
  const { threads } = useThreads();

  const initialConfig = liveblocksConfig({
    namespace: "Editor",
    editable: userAccessType === "editor" ? true : false,
    theme: LEXICAL_THEME,
    nodes: [HeadingNode],
    onError: (error: unknown) => {
      console.error(error);

      throw error;
    },
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="fixed top-0 left-0 z-50 w-full bg-dark-100">
        <Navbar
          documentId={documentId}
          documentTitle={documentTitle}
          userAccessType={userAccessType}
          documentUsers={documentUsers}
          creatorId={creatorId}
        />
        <Toolbar userAccessType={userAccessType} />
      </div>
      <div className="flex justify-center mt-10 text-white pt-[142px]">
        <div className="w-full flex flex-col justify-between gap-8 px-5 pb-4 xl:w-auto xl:flex-row xl:px-0">
          <RichTextPlugin
            contentEditable={
              <div className="flex justify-center">
                <ContentEditable className="w-full min-h-screen p-[56px] bg-dark-200 focus-visible:outline-none xl:w-[800px]" />
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <LiveblocksPlugin>
            <FloatingToolbar />
            <Threads />
            <FloatingThreads threads={threads} />
            <FloatingComposer />
            <Comments />
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
};

export default Editor;
