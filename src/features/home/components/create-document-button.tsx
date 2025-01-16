"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { createDocument } from "@/features/documents/core/actions";

import { Button } from "@/components/ui/button";
import { toast } from "@/lib/utils";

const CreateDocumentButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreateDocument = () => {
    startTransition(async () => {
      const room = await createDocument();

      if (room) {
        toast.success("Document created");

        router.push(`/documents/${room.id}`);
      }
    });
  };

  return (
    <Button
      disabled={isPending}
      className="rounded-md bg-gradient-to-t from-blue-500 to-blue-400"
      onClick={handleCreateDocument}
    >
      <PlusIcon className="size-5" />
      <span className="hidden lg:block">
        {isPending ? "Creating a blank document..." : "Start a blank document"}
      </span>
    </Button>
  );
};

export default CreateDocumentButton;
