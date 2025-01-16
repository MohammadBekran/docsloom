import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { liveblocks } from "@/lib/liveblocks";
import { generateRandomColor } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const POST = async (_request: NextRequest) => {
  try {
    const user = await currentUser();

    if (!user) redirect("/sign-in");

    const { fullName, imageUrl, emailAddresses } = user;

    const userEmail = emailAddresses[0].emailAddress;
    const username = fullName ?? userEmail;

    const { status, body } = await liveblocks.identifyUser(
      {
        userId: userEmail,
        groupIds: [],
      },
      {
        userInfo: {
          name: username,
          email: userEmail,
          avatar: imageUrl,
          color: generateRandomColor(username),
        },
      }
    );

    return new NextResponse(body, { status });
  } catch (error) {
    console.error(error);
  }
};
