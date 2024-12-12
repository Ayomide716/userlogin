import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      switch (error.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address");
          break;
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        default:
          setError("Failed to send reset email. Please try again.");
      }
      toast.error("Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight dark:text-white">Reset password</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        <AuthCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              disabled={isLoading}
            />

            <button 
              type="submit" 
              className="auth-button w-full py-2 px-4 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary dark:text-white"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        </AuthCard>

        <p className="text-center text-sm text-muted-foreground dark:text-gray-400">
          Remember your password?{" "}
          <Link
            to="/signin"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}