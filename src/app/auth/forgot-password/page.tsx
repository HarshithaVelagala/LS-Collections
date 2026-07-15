import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | LS Collections",
  description: "Reset your LS Collections account password.",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif text-foreground tracking-wider uppercase mb-2">Forgot Password</h1>
        <p className="text-muted-foreground text-xs font-light">Enter your email and we'll send you a link to reset your password.</p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
