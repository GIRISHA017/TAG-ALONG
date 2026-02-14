import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, User, Lock, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusOneLogo } from "@/components/PlusOneLogo";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Register() {
  const { register, checkUsername, setAuthState } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecked, setUsernameChecked] = useState(false);

  const checkUsernameAvailable = async () => {
    if (!username.trim() || username.length < 3) {
      setUsernameAvailable(null);
      setUsernameChecked(false);
      return;
    }
    setUsernameChecking(true);
    setUsernameChecked(false);
    const available = await checkUsername(username.trim());
    setUsernameAvailable(available);
    setUsernameChecked(true);
    setUsernameChecking(false);
    if (!available) {
      toast({ title: "This username already exists. Try another.", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !mobile.trim() || !username.trim() || !password) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (username.trim().length >= 3 && (!usernameChecked || usernameAvailable !== true)) {
      toast({ title: "Please check that your username is available first", variant: "destructive" });
      return;
    }
    if (usernameAvailable === false) {
      toast({ title: "This username is already taken. Choose another.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const result = await register({ email: email.trim(), mobile: mobile.trim(), username: username.trim(), password });
    setLoading(false);
    if (result.success) {
      toast({ title: "Account created! Please sign in with your email and password." });
    } else {
      toast({ title: result.error ?? "Registration failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen splash-bg flex flex-col">
      <div className="absolute inset-0 luxury-shine pointer-events-none" />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          className="w-full max-w-sm space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-center gap-2">
            <PlusOneLogo size="md" className="mb-2" />
            <p className="text-muted-foreground text-sm">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reg-email" className="text-foreground/90">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-mobile" className="text-foreground/90">
                Mobile number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-mobile"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-username" className="text-foreground/90">
                Username <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameChecked(false);
                      setUsernameAvailable(null);
                    }}
                    onBlur={checkUsernameAvailable}
                    className={cn(
                      "pl-10 bg-secondary/50 border-border",
                      usernameChecked && usernameAvailable === false && "border-destructive focus-visible:ring-destructive",
                    )}
                    autoComplete="username"
                  />
                  {usernameChecking && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </span>
                  )}
                  {usernameChecked && !usernameChecking && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameAvailable ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </span>
                  )}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={checkUsernameAvailable} disabled={usernameChecking || !username.trim()}>
                  Check
                </Button>
              </div>
              {usernameChecked && usernameAvailable === false && (
                <p className="text-xs text-destructive">This username already exists. Try another.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password" className="text-foreground/90">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={loading || (username.trim().length >= 3 && (!usernameChecked || usernameAvailable !== true))}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              className="text-primary font-medium hover:underline"
              onClick={() => setAuthState("login")}
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
