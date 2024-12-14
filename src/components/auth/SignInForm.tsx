import { useState } from "react";
import { AuthInput } from "./AuthInput";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SignInFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  errors: { [key: string]: string };
  isLoading: boolean;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
}

export function SignInForm({
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  errors,
  isLoading,
  rememberMe,
  setRememberMe,
}: SignInFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <AuthInput
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isLoading}
          autoFocus
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
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
            disabled={isLoading}
          />
          <label htmlFor="remember" className="text-sm text-muted-foreground">
            Remember me
          </label>
        </div>
      </div>

      {errors.auth && (
        <div className="text-sm text-destructive animate-fade-in">
          {errors.auth}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}