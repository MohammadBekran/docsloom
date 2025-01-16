"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

import Loader from "@/components/loader";

interface IRoomProps {
  roomId: string;
  children: React.ReactNode;
}

const Room = ({ roomId, children }: IRoomProps) => {
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;
