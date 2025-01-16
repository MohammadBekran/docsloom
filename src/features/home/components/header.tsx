import InboxNotifications from "@/features/home/components/inbox-notifications";

import { UserButton, SignedIn } from "@clerk/nextjs";

import Logo from "@/components/logo";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-center p-7">
      <Logo />
      <div className="flex gap-x-3">
        <InboxNotifications />
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
