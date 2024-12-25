import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { toast } from "sonner";

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.email) {
        setErrors(prev => ({ ...prev, email: "Email is required" }));
        return;
      }
      if (!formData.password) {
        setErrors(prev => ({ ...prev, password: "Password is required" }));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords don't match" }));
        return;
      }

      // Check if email exists first
      const signInMethods = await fetchSignInMethodsForEmail(auth, formData.email);
      if (signInMethods.length > 0) {
        setErrors(prev => ({ 
          ...prev, 
          email: "This email is already registered",
          auth: "Please sign in instead or use a different email address"
        }));
        toast.error("This email is already registered");
        setIsLoading(false);
        return;
      }

      // Proceed with account creation
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      if (userCredential.user) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrors(prev => ({ 
            ...prev, 
            email: "This email is already registered",
            auth: "Please sign in instead or use a different email address"
          }));
          toast.error("Email already in use");
          break;
        case "auth/weak-password":
          setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
          toast.error("Password should be at least 6 characters");
          break;
        case "auth/invalid-email":
          setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
          toast.error("Invalid email address");
          break;
        case "auth/network-request-failed":
          setErrors(prev => ({ ...prev, auth: "Network error. Please check your connection and try again" }));
          toast.error("Network error. Please check your connection");
          break;
        default:
          setErrors(prev => ({ ...prev, auth: "An unexpected error occurred. Please try again" }));
          toast.error("Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>

        <AuthCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <AuthInput
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={isLoading}
              />
              <AuthInput
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                disabled={isLoading}
              />
              <AuthInput
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                disabled={isLoading}
              />
            </div>

            {errors.auth && (
              <div className="text-sm text-destructive space-y-2">
                <p>{errors.auth}</p>
                {errors.auth.includes("sign in instead") && (
                  <Link
                    to="/signin"
                    className="block text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign in instead
                  </Link>
                )}
              </div>
            )}

            <button 
              type="submit" 
              className="auth-button w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </form>
        </AuthCard>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
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