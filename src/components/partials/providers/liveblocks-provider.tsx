"use client";

import { LiveblocksProvider as SuspenseLiveblocsProvider } from "@liveblocks/react/suspense";

import { getDocumentUsers, getUsers } from "@/features/documents/core/actions";

const LiveblocksProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SuspenseLiveblocsProvider
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
      {children}
    </SuspenseLiveblocsProvider>
  );
};

export default LiveblocksProvider;
