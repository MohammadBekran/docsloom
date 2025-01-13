import { ClerkProvider as CProvider } from "@clerk/nextjs";

const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return <CProvider>{children}</CProvider>;
};

export default ClerkProvider;
