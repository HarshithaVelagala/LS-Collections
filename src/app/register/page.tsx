import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register | LS Collections",
  description: "Create an account with LS Collections.",
};

export default function RegisterPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif text-foreground tracking-wider uppercase mb-2">Create Account</h1>
        <p className="text-muted-foreground text-xs font-light">Join us to experience seamless luxury shopping and exclusive perks.</p>
      </div>
      <RegisterForm />
    </>
  );
}
