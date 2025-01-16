import { UserButton } from "@clerk/nextjs";

import DocumentInput from "@/features/documents/components/document/document-input";
import ActiveCollaborators from "@/features/documents/components/document/active-collaborators";
import ShareDocumentModal from "@/features/documents/components/document/share-document-modal";
import type { TUser } from "@/features/documents/core/types";

import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";

interface INavbarProps {
  documentId: string;
  documentTitle: string;
  userAccessType: string;
  documentUsers: TUser[];
  creatorId: string;
}

const Navbar = ({
  documentId,
  documentTitle,
  userAccessType,
  documentUsers,
  creatorId,
}: INavbarProps) => {
  return (
    <>
      <nav className="w-full h-[92px] flex justify-between items-center px-4">
        <Logo className="hidden lg:flex" />
        <div className="flex gap-x-3">
          <div className="block lg:hidden">
            <Logo />
          </div>
          <DocumentInput documentTitle={documentTitle} />
        </div>
        <div className="flex items-center gap-2">
          <ActiveCollaborators />
          {userAccessType === "editor" && (
            <ShareDocumentModal
              documentId={documentId}
              documentUsers={documentUsers}
              creatorId={creatorId}
            />
          )}
          <UserButton />
        </div>
      </nav>
      <Separator className="bg-dark-300" />
    </>
  );
};

export default Navbar;
