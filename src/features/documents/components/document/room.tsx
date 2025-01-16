"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

import { getDocumentUsers, getUsers } from "@/features/home/core/actions";

import Loader from "@/components/loader";

interface IRoomProps {
  roomId: string;
  children: React.ReactNode;
}

const Room = ({ roomId, children }: IRoomProps) => {
  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const documentUsers = await getUsers(userIds);

        return documentUsers;
      }}
      resolveMentionSuggestions={async ({ roomId, text }) => {
        const users = await getDocumentUsers(roomId, text);

        return users ?? [];
      }}
    >
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};

export default Room;
