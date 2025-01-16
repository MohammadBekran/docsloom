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

const Editor = ({
  userAccessType,
}: {
  userAccessType: "viewer" | "editor";
}) => {
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
      <Toolbar userAccessType={userAccessType} />
      <div className="flex justify-center mt-10 text-white">
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
