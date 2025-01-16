import { ClerkProvider as CProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#3371FF",
          fontSize: "16px",
        },
      }}
    >
      {children}
    </CProvider>
  );
};

export default ClerkProvider;
