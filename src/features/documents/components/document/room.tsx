"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

import Loader from "@/components/loader";

interface IRoomProps {
  documentId: string;
  children: React.ReactNode;
}

const Room = ({ documentId, children }: IRoomProps) => {
  return (
    <RoomProvider id={documentId}>
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;
