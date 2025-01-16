import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DocsLoom - Sign up",
  description: "In this page you can sign up to DocsLoom",
};

const SignUpPage = () => {
  return <SignUp />;
};

export default SignUpPage;
