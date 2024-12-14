import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";

interface SocialSignInProps {
  onGoogleClick: () => Promise<void>;
  onGithubClick: () => Promise<void>;
  isLoading: boolean;
}

export function SocialSignIn({ onGoogleClick, onGithubClick, isLoading }: SocialSignInProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onGoogleClick}
        disabled={isLoading}
      >
        <Mail className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onGithubClick}
        disabled={isLoading}
      >
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
}