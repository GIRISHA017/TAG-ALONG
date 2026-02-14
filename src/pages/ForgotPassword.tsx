import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusOneLogo } from "@/components/PlusOneLogo";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const { setAuthState } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    toast({ title: "If an account exists, we've sent reset instructions to your email." });
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
            <p className="text-muted-foreground text-sm">Reset your password</p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-foreground/90">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border"
                    autoComplete="email"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the email you used to register. We&apos;ll send you a link to reset your password.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
              </Button>
            </form>
          ) : (
            <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                If an account exists for that email, we&apos;ve sent password reset instructions.
                Check your inbox and spam folder.
              </p>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            className="w-full gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setAuthState("login")}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Sign in
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
