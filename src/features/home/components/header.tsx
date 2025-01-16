import Image from "next/image";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-center p-7">
      <div className="flex items-center gap-3">
        <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        DocsLoom
      </div>
      <div />
    </div>
  );
};

export default Header;
