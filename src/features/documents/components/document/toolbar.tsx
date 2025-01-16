"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { OPEN_FLOATING_COMPOSER_COMMAND } from "@liveblocks/react-lexical";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  type LucideIcon,
  MessageCircleIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import DeleteDocumentModal from "@/features/documents/components/document/delete-document-modal";
import { clearFormatting } from "@/features/documents/core/utils";

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
      <div className="size-full flex justify-between items-center py-2 px-5">
        <div className="flex gap-x-2">
          <ToolbarButton
            icon={Undo2Icon}
            disabled={!canUndo}
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          />
          <ToolbarButton
            icon={Redo2Icon}
            disabled={!canRedo}
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          />
          <Separator orientation="vertical" className="h-[33px] bg-dark-500" />
          <ToolbarButton
            icon={Heading1Icon}
            isActive={activeBlock === "h1" && true}
            onClick={() => toggleBlock("h1")}
          />
          <ToolbarButton
            icon={Heading2Icon}
            isActive={activeBlock === "h2" && true}
            onClick={() => toggleBlock("h2")}
          />
          <ToolbarButton
            icon={Heading3Icon}
            isActive={activeBlock === "h3" && true}
            onClick={() => toggleBlock("h3")}
          />
          <Separator orientation="vertical" className="h-[33px] bg-dark-500" />
          <ToolbarButton
            icon={BoldIcon}
            isActive={isBold}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          />
          <ToolbarButton
            icon={ItalicIcon}
            isActive={isItalic}
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            }
          />
          <ToolbarButton
            icon={UnderlineIcon}
            isActive={isUnderline}
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            }
          />
          <ToolbarButton
            icon={StrikethroughIcon}
            isActive={isStrikethrough}
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
            }
          />
          <ToolbarButton
            icon={SubscriptIcon}
            isActive={isSubscript}
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")
            }
          />
          <ToolbarButton
            icon={SuperscriptIcon}
            isActive={isSuperscript}
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")
            }
          />

          <ToolbarButton
            icon={RemoveFormattingIcon}
            onClick={() => clearFormatting(editor)}
          />
          <Separator orientation="vertical" className="h-[33px] bg-dark-500" />
          <ToolbarButton
            icon={AlignRightIcon}
            isActive={false}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
            }
          />
          <ToolbarButton
            icon={AlignCenterIcon}
            isActive={false}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
            }
          />
          <ToolbarButton
            icon={AlignLeftIcon}
            isActive={false}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
            }
          />
          <ToolbarButton
            icon={AlignJustifyIcon}
            isActive={false}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
            }
          />
          <ToolbarButton
            icon={MessageCircleIcon}
            isActive={false}
            onClick={() =>
              editor.dispatchCommand(OPEN_FLOATING_COMPOSER_COMMAND, undefined)
            }
          />
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
