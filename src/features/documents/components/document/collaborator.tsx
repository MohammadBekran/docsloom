import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";

import UserAccessSelector from "@/features/documents/components/document/user-access-selector";
import type { TUser } from "@/features/documents/core/types";
import {
  removeUserAccess,
  updateUserAccess,
} from "@/features/home/core/actions";

import { Button } from "@/components/ui/button";
import { toast } from "@/lib/utils";

interface ICollaboratorProps {
  collaborator: TUser;
  documentId: string;
  creatorId: string;
  user: Pick<TUser, "name" | "email" | "avatar">;
}

const Collaborator = ({
  collaborator,
  documentId,
  creatorId,
  user,
}: ICollaboratorProps) => {
  const [isUpdatingUserAccessPending, startIsUpdatingUserAccessTransition] =
    useTransition();
  const [isRemovingUserAccessPending, startIsRemovingUserAccessTransition] =
    useTransition();

  const { id, email, name, avatar } = collaborator;

  const isDisabled = isUpdatingUserAccessPending || isRemovingUserAccessPending;

  const handleUpdateUserAccess = async (
    userAccess: string,
    userEmail: string
  ) => {
    startIsUpdatingUserAccessTransition(async () => {
      const updatedDocument = await updateUserAccess(
        documentId,
        userEmail,
        userAccess,
        user
      );

      if (updatedDocument) toast.success("User access updated");
    });
  };

  const handleRemoveUserAccess = async () => {
    startIsRemovingUserAccessTransition(async () => {
      await removeUserAccess(documentId, id);
    });
  };

  return (
    <li key={id} className="flex items-center gap-x-2">
      <div>
        <Image
          src={avatar}
          alt="Avatar"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex gap-2">
            <span className="text-sm font-semibold line-clamp-1 leading-4 text-white">
              {name}
            </span>
            {isUpdatingUserAccessPending && (
              <span className="text-sm text-muted-foreground">Updating...</span>
            )}
          </div>
          <span className="text-sm font-light text-blue-100">{email}</span>
        </div>
        {creatorId === id ? (
          <p className="text-sm text-blue-100">Owner</p>
        ) : (
          <div className="flex gap-x-2">
            <UserAccessSelector
              value={collaborator.userType}
              disabled={isDisabled}
              onValueChange={(userType) =>
                handleUpdateUserAccess(userType, email)
              }
            />
            <Button
              size="icon"
              disabled={isDisabled}
              className="bg-red-800"
              onClick={handleRemoveUserAccess}
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </li>
  );
};

export default Collaborator;
