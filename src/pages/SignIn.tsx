import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Basic validation
    if (!email) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      setIsLoading(false);
      return;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully signed in!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Handle Firebase auth errors
      switch (error.code) {
        case "auth/invalid-login-credentials":
        case "auth/user-not-found":
        case "auth/wrong-password":
          toast.error("Invalid email or password");
          setErrors(prev => ({ ...prev, auth: "Invalid email or password. Please check your credentials and try again." }));
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format");
          setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
          break;
        case "auth/network-request-failed":
          toast.error("Network error. Please check your connection");
          setErrors(prev => ({ ...prev, auth: "Network error. Please check your connection and try again" }));
          break;
        case "auth/too-many-requests":
          toast.error("Too many failed attempts. Please try again later");
          setErrors(prev => ({ ...prev, auth: "Access temporarily disabled due to many failed attempts. Please try again later" }));
          break;
        default:
          toast.error("An error occurred during sign in");
          setErrors(prev => ({ ...prev, auth: "An unexpected error occurred. Please try again" }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>

        <AuthCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <AuthInput
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                disabled={isLoading}
              />
              <AuthInput
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {errors.auth && (
              <p className="text-sm text-destructive">{errors.auth}</p>
            )}

            <button 
              type="submit" 
              className="auth-button disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </AuthCard>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}