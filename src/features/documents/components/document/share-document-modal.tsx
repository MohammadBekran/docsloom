"use client";

import { useState, useTransition } from "react";
import { Share2Icon } from "lucide-react";
import { useSelf } from "@liveblocks/react/suspense";

import UserAccessSelector from "@/features/documents/components/document/user-access-selector";
import type { TUser } from "@/features/documents/core/types";
import { updateUserAccess } from "@/features/documents/core/actions";
import Collaborator from "@/features/documents/components/document/collaborator";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/utils";

interface IShareDocumentModalProps {
  documentId: string;
  documentUsers: TUser[];
  creatorId: string;
}

const ShareDocumentModal = ({
  documentId,
  documentUsers,
  creatorId,
}: IShareDocumentModalProps) => {
  const [email, setEmail] = useState("");
  const [userAccess, setUserAccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const user = useSelf();

  const handleUserAccess = (userType: string) => setUserAccess(userType);

  const handleInviteUser = () => {
    startTransition(async () => {
      const updatedDocument = await updateUserAccess(
        documentId,
        email,
        userAccess,
        user.info
      );

      if (updatedDocument) toast.success("User access updated");
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-[37px] bg-gradient-to-r from-blue-500 to-blue-400">
          <Share2Icon className="size-5" />
          <span className="hidden lg:block">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] max-w-[500px] rounded-xl shadow-xl border-0 py-7 px-5 bg-[url('/background-image.png')] bg-cover lg:min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>
            Select which users can view and edit this document
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <div className="flex flex-col gap-y-3">
            <Label htmlFor="email">Email address</Label>
            <div className="size-full flex justify-between gap-x-3">
              <div className="size-full flex rounded-md bg-dark-400">
                <Input
                  type="text"
                  disabled={isPending}
                  value={email}
                  placeholder="Enter email address"
                  className="h-11 bg-transparent outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <UserAccessSelector
                  value={userAccess}
                  disabled={isPending}
                  onValueChange={handleUserAccess}
                />
              </div>
              <Button
                disabled={!email || isPending}
                className="w-[85px] h-[43px] bg-gradient-to-r from-blue-500 to-blue-400"
                onClick={handleInviteUser}
              >
                {isPending ? "Sending..." : "Invite"}
              </Button>
            </div>
          </div>
          <ul className="flex flex-col gap-y-5 my-6">
            {documentUsers.map((collaborator) => (
              <Collaborator
                key={collaborator.id}
                collaborator={collaborator}
                documentId={documentId}
                creatorId={creatorId}
                user={user.info}
              />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocumentModal;
