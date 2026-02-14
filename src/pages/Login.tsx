import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusOneLogo } from "@/components/PlusOneLogo";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { login, setAuthState } = useAuth();
  const { toast } = useToast();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password) {
      toast({ title: "Please enter email/username and password", variant: "destructive" });
      return;
    }
    setLoading(true);
    const result = login(emailOrUsername.trim(), password);
    setLoading(false);
    if (result.success) {
      toast({ title: "Welcome back!" });
      return;
    }
    if (result.needsApproval) {
      toast({ title: "New device detected", description: "Check your email to approve this login.", variant: "default" });
      return;
    }
    toast({ title: result.error ?? "Login failed", variant: "destructive" });
  };

  return (
    <div className="min-h-screen splash-bg flex flex-col">
      <div className="absolute inset-0 luxury-shine pointer-events-none" />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          className="w-full max-w-sm space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-center gap-4">
            <PlusOneLogo size="md" className="mb-2" />
            <p className="text-muted-foreground text-sm">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/90">
                Email or username
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
                  placeholder="you@example.com or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border"
                  autoComplete="username email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground/90">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setAuthState("forgot_password")}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border"
                  autoComplete="current-password"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="text-primary font-medium hover:underline"
              onClick={() => setAuthState("register")}
            >
              Create account
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
