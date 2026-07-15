import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Password | LS Collections",
  description: "Set a new password for your LS Collections account.",
};

export default function ResetPasswordPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif text-foreground tracking-wider uppercase mb-2">Secure Your Account</h1>
        <p className="text-muted-foreground text-xs font-light">Please enter your new strong password below.</p>
      </div>
      <ResetPasswordForm />
    </>
  );
}
