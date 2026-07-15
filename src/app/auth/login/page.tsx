export const metadata = {
  title: "Login | LS Collections",
  description: "Sign in to your LS Collections account.",
};

import { redirect } from "next/navigation";

export default function LoginPage() {
  redirect("/login");
}
