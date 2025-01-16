import { OPEN_FLOATING_COMPOSER_COMMAND } from "@liveblocks/react-lexical";
import {
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
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

export const TOOLBAR_BUTTONS = (
  editor: LexicalEditor,
  canUndo: boolean,
  canRedo: boolean,
  activeBlock: string | null,
  isBold: boolean,
  isItalic: boolean,
  isUnderline: boolean,
  isStrikethrough: boolean,
  isSubscript: boolean,
  isSuperscript: boolean,
  toggleBlock: (type: "h1" | "h2" | "h3" | "quote") => void,
  onClearFormatting: () => void
): {
  icon: LucideIcon;
  disabled?: boolean;
  isActive?: boolean;
  onClick: () => void;
}[][] => [
  [
    {
      icon: Undo2Icon,
      disabled: !canUndo,
      onClick: () => editor.dispatchCommand(UNDO_COMMAND, undefined),
    },
    {
      icon: Redo2Icon,
      disabled: !canRedo,
      onClick: () => editor.dispatchCommand(REDO_COMMAND, undefined),
    },
  ],
  [
    {
      icon: Heading1Icon,
      isActive: activeBlock === "h1",
      onClick: () => toggleBlock("h1"),
    },
    {
      icon: Heading2Icon,
      isActive: activeBlock === "h2",
      onClick: () => toggleBlock("h2"),
    },
    {
      icon: Heading3Icon,
      isActive: activeBlock === "h3",
      onClick: () => toggleBlock("h3"),
    },
  ],
  [
    {
      icon: BoldIcon,
      isActive: isBold,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"),
    },
    {
      icon: ItalicIcon,
      isActive: isItalic,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"),
    },
    {
      icon: UnderlineIcon,
      isActive: isUnderline,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline"),
    },
    {
      icon: StrikethroughIcon,
      isActive: isStrikethrough,
      onClick: () =>
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough"),
    },
    {
      icon: SubscriptIcon,
      isActive: isSubscript,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript"),
    },
    {
      icon: SuperscriptIcon,
      isActive: isSuperscript,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript"),
    },
    {
      icon: RemoveFormattingIcon,
      onClick: onClearFormatting,
    },
  ],
  [
    {
      icon: AlignRightIcon,
      onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right"),
    },
    {
      icon: AlignCenterIcon,
      onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center"),
    },
    {
      icon: AlignLeftIcon,
      onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left"),
    },
    {
      icon: AlignJustifyIcon,
      onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify"),
    },
  ],
  [
    {
      icon: MessageCircleIcon,
      onClick: () =>
        editor.dispatchCommand(OPEN_FLOATING_COMPOSER_COMMAND, undefined),
    },
  ],
];
