import InboxNotifications from "@/features/home/components/inbox-notifications";

import Logo from "@/components/logo";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-center p-7">
      <Logo />
      <InboxNotifications />
    </div>
  );
};

export default Header;
