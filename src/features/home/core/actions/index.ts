"use server";

import { liveblocks } from "@/lib/liveblocks";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { TUser } from "@/features/documents/core/types";

import { parseStringify } from "@/lib/utils";

export const getDocumentUsers = async (roomId: string, text: string) => {
  try {
    const user = await currentUser();

    if (!user) redirect("/sign-in");

    const document = await liveblocks.getRoom(roomId);
    if (!document) throw new Error("Document not found");

    const users = Object.keys(document.usersAccesses).filter(
      (email) => email !== user?.emailAddresses[0].emailAddress
    );

    if (text) {
      users.filter((user) => user.toLowerCase().includes(text.toLowerCase()));
    }

    return parseStringify(users);
  } catch (error) {
    console.error(error);
  }
};

export const getDocument = async (roomId: string) => {
  try {
    const user = await currentUser();
    const room = await liveblocks.getRoom(roomId);

    const hasUserAccess =
      room.usersAccesses[user?.emailAddresses[0].emailAddress ?? ""];

    if (!hasUserAccess) redirect("/");

    return room;
  } catch (error) {
    console.error(error);
  }
};

export const getUsers = async (userIds: string[]) => {
  try {
    const clerk = await clerkClient();

    const users = await clerk.users.getUserList({
      emailAddress: userIds,
    });

    const mappedUsers = users.data.map(
      ({ id, fullName, imageUrl, primaryEmailAddress }) => ({
        id,
        name: fullName ?? primaryEmailAddress?.emailAddress ?? "Anonymous",
        email: primaryEmailAddress?.emailAddress ?? "",
        avatar: imageUrl,
        color: "",
      })
    );

    return parseStringify(mappedUsers);
  } catch (error) {
    console.error(error);
  }
};

export const createDocument = async () => {
  try {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    const { emailAddresses } = user;

    const id = nanoid();
    const userEmail = emailAddresses[0].emailAddress;

    const document = await liveblocks.createRoom(id, {
      metadata: {
        creatorId: user.id,
        email: userEmail,
        title: "Untitled",
      },
      usersAccesses: {
        [userEmail]: ["room:write"],
      },
      defaultAccesses: [],
    });

    revalidatePath("/");

    return parseStringify(document);
  } catch (error) {
    console.error(error);
  }
};

export const updateDocument = async (
  documentId: string,
  newDocumentTitle: string
) => {
  try {
    const updatedDocument = await liveblocks.updateRoom(documentId, {
      metadata: {
        title: newDocumentTitle,
      },
    });

    revalidatePath(`/documents/${documentId}`);

    return parseStringify(updatedDocument);
  } catch (error) {
    console.error(error);
  }
};

export const updateUserAccess = async (
  documentId: string,
  userId: string,
  accessLevel: string,
  updatedBy: Pick<TUser, "name" | "email" | "avatar">
) => {
  try {
    const document = await liveblocks.getRoom(documentId);

    if (!document) throw new Error("Document not found");

    const updatedUserAccesses = {
      [userId]:
        accessLevel === "editor"
          ? ["room:write"]
          : ["room:read", "room:presence:write"],
    } as Record<
      string,
      ["room:write"] | ["room:read", "room:presence:write"] | null
    >;

    const updatedRoom = await liveblocks.updateRoom(documentId, {
      usersAccesses: updatedUserAccesses,
    });

    if (updatedRoom) {
      const id = nanoid();

      liveblocks.triggerInboxNotification({
        userId,
        roomId: documentId,
        kind: "$documentAccess",
        subjectId: id,
        activityData: {
          title: `You have been granted ${accessLevel} access the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email,
        },
      });
    }

    revalidatePath(`/documents/${documentId}`);

    return parseStringify(updatedRoom);
  } catch (error) {
    console.error(error);
  }
};

export const removeUserAccess = async (documentId: string, userId: string) => {
  try {
    const document = await liveblocks.getRoom(documentId);

    if (!document) throw new Error("Document not found");

    const updatedUserAccesses = {
      [userId]: null,
    };

    await liveblocks.updateRoom(documentId, {
      usersAccesses: updatedUserAccesses,
    });

    revalidatePath("/");
  } catch (error) {
    console.error(error);
  }
};

export const deleteDocument = async (documentId: string) => {
  try {
    const deletedDocument = await liveblocks.deleteRoom(documentId);

    revalidatePath("/");

    return parseStringify(deletedDocument);
  } catch (error) {
    console.error(error);
  }
};
