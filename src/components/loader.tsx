import { LoaderIcon } from "lucide-react";

const Loader = () => {
  return (
    <div className="size-full min-h-screen flex justify-center items-center">
      <LoaderIcon className="size-7 text-muted-foreground animate-spin" />
    </div>
  );
};

export default Loader;
