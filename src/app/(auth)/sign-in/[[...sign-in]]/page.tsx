import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DocsLoom - Sign in",
  description: "In this page you can sign in to DocsLoom",
};

const SignInPage = () => {
  return <SignIn />;
};

export default SignInPage;
