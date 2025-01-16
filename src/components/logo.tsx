import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <Image src="/logo.svg" alt="Logo" width={36} height={36} />
      <span className="hidden text-lg text-muted lg:block">DocsLoom</span>
    </Link>
  );
};

export default Logo;
