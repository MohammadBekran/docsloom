// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Room from "@/features/documents/components/document/room";
import Editor from "@/features/documents/components/document/editor";
import Navbar from "@/features/documents/components/document/navbar";
import { getDocument, getUsers } from "@/features/home/core/actions";
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
    <Room roomId={documentId}>
      <Navbar
        documentId={documentId}
        documentTitle={document.metadata.title as string}
        userAccessType={userAccessType}
        documentUsers={documentUsers}
        creatorId={document.metadata.creatorId as string}
      />
      <Editor userAccessType={userAccessType} />
    </Room>
  );
};

export default Document;
