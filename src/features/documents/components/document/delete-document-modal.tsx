"use client";

import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteDocument } from "@/features/documents/core/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/lib/utils";

const DeleteDocumentModal = ({ documentId }: { documentId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDeleteDocument = () => {
    startTransition(async () => {
      const deletedDocument = await deleteDocument(documentId);

      if (deletedDocument) {
        toast.success("Document deleted");

        router.push("/");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <TrashIcon className="size-4 text-red-400" />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[450px] max-w-[500px] rounded-xl shadow-xl border-0 py-7 px-5 bg-[url('/background-image.png')] bg-cover lg:min-w-[500px]">
        <DialogHeader>
          <div className="flex justify-center items-center mb-4 lg:block">
            <Image
              src="/delete-modal.svg"
              alt="Delete"
              width={48}
              height={48}
            />
          </div>
          <DialogTitle>Delete document</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this document? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button
            disabled={isPending}
            className="w-full h-10 bg-gradient-to-t from-red-500 to-red-400"
            onClick={handleDeleteDocument}
          >
            {isPending ? "Deleting..." : "Delete Document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDocumentModal;
