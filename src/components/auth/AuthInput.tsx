import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <input
          className={cn(
            "auth-input",
            error && "border-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";

export { AuthInput };