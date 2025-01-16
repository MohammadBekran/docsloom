import { BaseMetadata, ThreadData } from "@liveblocks/client";
import { useIsThreadActive } from "@liveblocks/react-lexical";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useThreads } from "@liveblocks/react/suspense";

import { cn } from "@/lib/utils";

const Threads = ({ thread }: { thread: ThreadData<BaseMetadata> }) => {
  const isActive = useIsThreadActive(thread.id);

  return (
    <Thread
      thread={thread}
      data-state={isActive ? "active" : null}
      className={cn(
        "border border-dark-300 shadow-sm !bg-dark-200 text-white lg:w-[350px]",
        {
          "!border-blue-500 shadow-md": isActive,
          "opacity-40": thread.resolved,
        }
      )}
    />
  );
};

const Comments = () => {
  const threads = useThreads();

  return (
    <div className="flex flex-col gap-y-4">
      <Composer className="w-full max-w-[800px] border border-dark-300 shadow-sm bg-dark-200 lg:w-[350px] text-white" />
      {threads.threads.map((thread) => (
        <Threads key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default Comments;
