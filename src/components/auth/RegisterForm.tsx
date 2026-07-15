"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Too Short",
    color: "bg-zinc-800",
  });

  // Calculate password strength
  useEffect(() => {
    const password = formData.password;
    if (!password) {
      setPasswordStrength({ score: 0, label: "Too Short", color: "bg-zinc-800" });
      return;
    }

    if (password.length < 8) {
      setPasswordStrength({ score: 1, label: "Too Short", color: "bg-rose-500" });
      return;
    }

    let score = 0;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&#]/.test(password)) score++;

    let label = "Weak";
    let color = "bg-rose-500";

    if (score === 1 || score === 2) {
      label = "Fair";
      color = "bg-amber-500";
    } else if (score === 3) {
      label = "Good";
      color = "bg-blue-400";
    } else if (score === 4) {
      label = "Strong";
      color = "bg-gold";
    }

    setPasswordStrength({ score: score === 0 ? 1 : score, label, color });
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasLowercase = /[a-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const hasSpecial = /[@$!%*?&#]/.test(formData.password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setError("Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await register(formData);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 text-xs font-semibold text-center rounded-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">First Name</label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="e.g. Devyani"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Last Name</label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="e.g. Sharma"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="Enter your email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Mobile Number</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="Enter mobile number"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2 relative">
        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-12"
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Strength Indicator */}
        {formData.password && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold">
              <span className="text-muted-foreground">Password Strength:</span>
              <span className={
                passwordStrength.label === "Strong" ? "text-gold" : 
                passwordStrength.label === "Good" ? "text-blue-400" :
                passwordStrength.label === "Fair" ? "text-amber-500" : "text-rose-500"
              }>{passwordStrength.label}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 h-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-full rounded-sm transition-all duration-300 ${
                    step <= passwordStrength.score ? passwordStrength.color : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 relative">
        <label className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Confirm Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full bg-background border border-border text-foreground rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-12"
            placeholder="Confirm your password"
          />
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          name="agreeToTerms"
          id="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          className="bg-card border-border accent-gold h-4 w-4 rounded-sm mt-0.5"
        />
        <label htmlFor="agreeToTerms" className="text-xs text-muted-foreground leading-normal">
          I agree to the{" "}
          <Link href="/terms" className="text-gold hover:text-foreground transition-colors">
            Terms & Conditions
          </Link>{" "}
          and Privacy Policy.
        </label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-gold-light text-white font-bold tracking-widest uppercase rounded-none transition-colors h-12 shadow-md hover:shadow-primary/20"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
      </Button>

      <div className="text-center mt-6">
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-gold uppercase tracking-wider font-bold hover:text-foreground transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
}
