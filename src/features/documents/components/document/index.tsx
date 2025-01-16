// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Editor from "@/features/documents/components/document/editor";
import Room from "@/features/documents/components/document/room";
import { getDocument, getUsers } from "@/features/documents/core/actions";
import type { TUser } from "@/features/documents/core/types";

const Document = async ({ documentId }: { documentId: string }) => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const document = await getDocument(documentId);
  if (!document) redirect("/");

  const userAccessType = document.usersAccesses[
    user.emailAddresses[0].emailAddress
  ]?.includes("room:write")
    ? "editor"
    : "viewer";

  const users = await getUsers();
  const documentUserAccesses = Object.keys(document.usersAccesses);
  const documentUsers: TUser[] = [];

  documentUserAccesses.forEach((userEmail) => {
    const foundUser = users.find(
      (user: { emailAddresses: { emailAddress }[] }) => user.email === userEmail
    );
    documentUsers.push({
      ...foundUser,
      userType: document.usersAccesses[userEmail]?.includes("room:write")
        ? "editor"
        : "viewer",
    });
  });

  return (
    <Room documentId={documentId}>
      <Editor
        documentId={documentId}
        documentTitle={document.metadata.title as string}
        userAccessType={userAccessType}
        documentUsers={documentUsers}
        creatorId={document.metadata.creatorId as string}
      />
    </Room>
  );
};

export default Document;
