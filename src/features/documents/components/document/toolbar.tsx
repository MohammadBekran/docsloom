"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { type LucideIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import DeleteDocumentModal from "@/features/documents/components/document/delete-document-modal";
import { TOOLBAR_BUTTONS } from "@/features/documents/core/constants";
import { clearFormatting } from "@/features/documents/core/utils";

import { Separator } from "@/components/ui/separator";

interface IToolbarButtonProps {
  icon: LucideIcon;
  disabled?: boolean;
  isActive?: boolean;
  onClick: () => void;
}

const ToolbarButton = ({
  icon: Icon,
  disabled,
  isActive,
  onClick,
}: IToolbarButtonProps) => {
  return (
    <Button
      size="icon"
      disabled={disabled}
      className={cn(
        "size-8 rounded-none transition-colors bg-transparent hover:bg-dark-300",
        {
          "bg-dark-300": isActive,
        }
      )}
      onClick={onClick}
    >
      <Icon className="size-4 text-muted" />
    </Button>
  );
};

const useActiveBlock = () => {
  const [editor] = useLexicalComposerContext();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      return editor.registerUpdateListener(onStoreChange);
    },
    [editor]
  );

  const getSnapshot = useCallback(() => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return null;

      const anchor = selection.anchor.getNode();
      let element =
        anchor.getKey() === "root"
          ? anchor
          : $findMatchingParent(anchor, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchor.getTopLevelElementOrThrow();
      }

      if ($isHeadingNode(element)) {
        return element.getTag();
      }

      return element.getType();
    });
  }, [editor]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

const Toolbar = ({ userAccessType }: { userAccessType: string }) => {
  const { documentId } = useParams();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [editor] = useLexicalComposerContext();
  const activeBlock = useActiveBlock();

  const disabled = userAccessType === "viewer";

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
    }
  }, []);

  const toggleBlock = (type: "h1" | "h2" | "h3" | "quote") => {
    editor.update(() => {
      const selection = $getSelection();

      if (activeBlock === type) {
        return $setBlocksType(selection, () => $createParagraphNode());
      } else if (type === "h1") {
        return $setBlocksType(selection, () => $createHeadingNode("h1"));
      } else if (type === "h2") {
        return $setBlocksType(selection, () => $createHeadingNode("h2"));
      } else if (type === "h3") {
        return $setBlocksType(selection, () => $createHeadingNode("h3"));
      } else if (type === "quote") {
        return $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const TOOLBAR_BUTTONS_TO_MAP = TOOLBAR_BUTTONS(
    editor,
    canUndo,
    canRedo,
    activeBlock,
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isSubscript,
    isSuperscript,
    toggleBlock,
    () => clearFormatting(editor)
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();

          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => $updateToolbar());
      }),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, editor]);

  return (
    <ScrollArea>
      <div className="size-full flex justify-between items-center gap-x-5 py-2 px-5">
        <div className="flex gap-x-2">
          {TOOLBAR_BUTTONS_TO_MAP[0].map((item, index) => (
            <ToolbarButton
              key={`${item.icon}-${index}`}
              disabled={disabled || item.disabled}
              {...item}
            />
          ))}
          <Separator orientation="vertical" className="toolbar-separator" />
          {TOOLBAR_BUTTONS_TO_MAP[1].map((item, index) => (
            <ToolbarButton
              key={`${item.icon}-${index}`}
              disabled={disabled || item.disabled}
              {...item}
            />
          ))}
          <Separator orientation="vertical" className="toolbar-separator" />
          {TOOLBAR_BUTTONS_TO_MAP[2].map((item, index) => (
            <ToolbarButton
              key={`${item.icon}-${index}`}
              disabled={disabled || item.disabled}
              {...item}
            />
          ))}
          <Separator orientation="vertical" className="toolbar-separator" />
          {TOOLBAR_BUTTONS_TO_MAP[3].map((item, index) => (
            <ToolbarButton
              key={`${item.icon}-${index}`}
              disabled={disabled || item.disabled}
              {...item}
            />
          ))}
          <Separator orientation="vertical" className="toolbar-separator" />
          {TOOLBAR_BUTTONS_TO_MAP[4].map((item, index) => (
            <ToolbarButton
              key={`${item.icon}-${index}`}
              disabled={disabled || item.disabled}
              {...item}
            />
          ))}
        </div>
        {userAccessType === "editor" && (
          <DeleteDocumentModal documentId={documentId as string} />
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Toolbar;
