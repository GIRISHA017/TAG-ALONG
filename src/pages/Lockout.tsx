import { motion } from "framer-motion";
import { Lock, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getRemainingLockMinutes } from "@/lib/auth-storage";
import { PlusOneLogo } from "@/components/PlusOneLogo";

export default function Lockout() {
  const { setAuthState } = useAuth();
  const [minutes, setMinutes] = useState(getRemainingLockMinutes());

  useEffect(() => {
    const interval = setInterval(() => {
      const m = getRemainingLockMinutes();
      setMinutes(m);
      if (m <= 0) {
        setAuthState("login");
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [setAuthState]);

  return (
    <div className="min-h-screen splash-bg flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 luxury-shine pointer-events-none" />
      <motion.div
        className="relative z-10 max-w-sm w-full text-center space-y-8"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <PlusOneLogo size="md" className="mb-6" />
        <div className="rounded-2xl bg-card/80 border border-border p-8 space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/20 p-4">
              <Lock className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-2">Account temporarily locked</h1>
            <p className="text-muted-foreground text-sm">
              Too many failed login attempts. For your security, access is blocked for 3 hours.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-accent">
            <Clock className="h-5 w-5" />
            <span className="font-medium">
              {minutes > 0 ? `You can try again in ${minutes} minute${minutes !== 1 ? "s" : ""}` : "Checking..."}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            If this wasn&apos;t you, we recommend changing your password after you regain access.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
