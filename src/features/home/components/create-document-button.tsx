"use client";

import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

import { createDocument } from "@/features/home/core/actions";

import { Button } from "@/components/ui/button";

const CreateDocumentButton = () => {
  const router = useRouter();

  const handleCreateDocument = async () => {
    const room = await createDocument();

    if (room) router.push(`/documents/${room.id}`);
  };

  return (
    <Button
      className="rounded-md bg-gradient-to-t from-blue-500 to-blue-400"
      onClick={handleCreateDocument}
    >
      <PlusIcon className="size-4" />
      Add Document
    </Button>
  );
};

export default CreateDocumentButton;
