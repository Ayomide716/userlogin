import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthCard } from "@/components/auth/AuthCard";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { SignInForm } from "@/components/auth/SignInForm";
import { SocialSignIn } from "@/components/auth/SocialSignIn";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      console.log("Sign in successful:", result.user);
      toast.success("Successfully signed in!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Sign in error:", error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const authProvider = provider === 'google' 
        ? new GoogleAuthProvider() 
        : new GithubAuthProvider();
      
      // Add scopes for better user data access
      if (provider === 'google') {
        authProvider.addScope('profile');
        authProvider.addScope('email');
      }
      
      const result = await signInWithPopup(auth, authProvider);
      console.log(`${provider} sign in successful:`, result.user);
      toast.success("Successfully signed in!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(`${provider} sign in error:`, error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error: any) => {
    switch (error.code) {
      case "auth/unauthorized-domain":
        toast.error("Authentication domain not authorized");
        setErrors({
          auth: "This domain is not authorized for authentication. Please contact support."
        });
        break;
      case "auth/invalid-login-credentials":
        toast.error("Invalid email or password");
        setErrors({
          auth: "The email or password you entered is incorrect. Please try again."
        });
        break;
      case "auth/invalid-email":
        toast.error("Invalid email format");
        setErrors({ email: "Please enter a valid email address" });
        break;
      case "auth/network-request-failed":
        toast.error("Network error. Please check your connection");
        setErrors({
          auth: "Unable to connect. Please check your internet connection and try again."
        });
        break;
      case "auth/popup-closed-by-user":
        toast.error("Sign in cancelled");
        break;
      case "auth/cancelled-popup-request":
        // Ignore this error as it's handled by the popup-closed-by-user error
        break;
      case "auth/too-many-requests":
        toast.error("Too many failed attempts. Please try again later");
        setErrors({
          auth: "Access temporarily disabled due to many failed attempts. Please try again later."
        });
        break;
      default:
        toast.error("An error occurred during sign in");
        setErrors({
          auth: "An unexpected error occurred. Please try again."
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <AuthCard>
          <SignInForm
            onSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            errors={errors}
            isLoading={isLoading}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
          />

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <SocialSignIn
              onGoogleClick={() => handleSocialSignIn('google')}
              onGithubClick={() => handleSocialSignIn('github')}
              isLoading={isLoading}
            />
          </div>
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