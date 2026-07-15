import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | LS Collections",
  description: "Sign in to your LS Collections account.",
};

export default function LoginPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif text-foreground tracking-wider uppercase mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-xs font-light">Sign in to access your orders, wishlist, and exclusive offers.</p>
      </div>
      <LoginForm />
    </>
  );
}
