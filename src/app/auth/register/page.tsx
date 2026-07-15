export const metadata = {
  title: "Register | LS Collections",
  description: "Create an account with LS Collections.",
};

import { redirect } from "next/navigation";

export default function RegisterPage() {
  redirect("/register");
}
