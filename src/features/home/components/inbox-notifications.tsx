"use client";

import {
  ClientSideSuspense,
  useInboxNotifications,
} from "@liveblocks/react/suspense";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import { BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const InboxNotifications = () => {
  return (
    <ClientSideSuspense fallback={null}>
      <InboxNotificationsDropdown />
    </ClientSideSuspense>
  );
};

export default InboxNotifications;

const InboxNotificationsDropdown = () => {
  const { inboxNotifications } = useInboxNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative bg-dark-400 text-white hover:bg-dark-500 hover:text-white"
        >
          <BellIcon className="size-5" />
          {inboxNotifications.length > 0 && (
            <div className="absolute -top-1 -right-1 size-2 rounded-full bg-blue-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-none bg-transparent">
        {inboxNotifications.length > 0 ? (
          <InboxNotificationList>
            {inboxNotifications.map((inboxNotification) => (
              <InboxNotification
                key={inboxNotification.id}
                inboxNotification={inboxNotification}
                href={`/documents/${inboxNotification.roomId}`}
                showActions={false}
                kinds={{
                  thread: (props) => (
                    <InboxNotification.Thread
                      {...props}
                      showActions={false}
                      showRoomName={false}
                    />
                  ),
                  textMention: (props) => (
                    <InboxNotification.TextMention
                      {...props}
                      showRoomName={false}
                    />
                  ),
                  $documentAccess: (props) => {
                    const activitiesData =
                      props.inboxNotification.activities[0].data;

                    return (
                      <InboxNotification.Custom
                        {...props}
                        title={activitiesData.title}
                        aside={
                          <InboxNotification.Icon className="bg-transparent">
                            <Image
                              src={(activitiesData.avatar as string) ?? ""}
                              alt="Avatar"
                              width={36}
                              height={36}
                              className="rounded-full"
                            />
                          </InboxNotification.Icon>
                        }
                      >
                        {props.children}
                      </InboxNotification.Custom>
                    );
                  },
                }}
              />
            ))}
          </InboxNotificationList>
        ) : (
          <p className="text-muted">No notifications</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
