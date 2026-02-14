import { motion } from "framer-motion";
import { Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PlusOneLogo } from "@/components/PlusOneLogo";

export default function NewDevicePending() {
  const { approveNewDevice } = useAuth();

  return (
    <div className="min-h-screen splash-bg flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 luxury-shine pointer-events-none" />
      <motion.div
        className="relative z-10 max-w-sm w-full text-center space-y-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PlusOneLogo size="md" className="mb-6" />
        <div className="rounded-2xl bg-card/80 border border-border p-8 space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/20 p-4">
              <Mail className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-2">New device detected</h1>
            <p className="text-muted-foreground text-sm">
              We&apos;ve sent an approval link to your email. Click the link to allow this device to sign in. This keeps
              your account secure.
            </p>
          </div>
          <div className="rounded-lg bg-secondary/50 border border-border p-4 text-left">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
              Login from this device will only be allowed after you approve it via email.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            For demo: click below to simulate approving this device via email.
          </p>
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={approveNewDevice}>
            I&apos;ve approved this device
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
