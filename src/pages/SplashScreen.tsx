import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PlusOneLogo } from "@/components/PlusOneLogo";

export default function SplashScreen() {
  const { setAuthState } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => {
      setAuthState("login");
    }, 2800);
    return () => clearTimeout(t);
  }, [setAuthState]);

  return (
    <div className="fixed inset-0 splash-bg overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 luxury-shine pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(234,88,12,0.12),transparent)] pointer-events-none" />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-8 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="rounded-2xl bg-[#0F0F14]/80 border border-[#EA580C]/30 p-6 shadow-[0_0_40px_-8px_rgba(234,88,12,0.4)]">
            <PlusOneLogo size="splash" />
          </div>
          <motion.p
            className="text-white/90 text-center text-lg sm:text-xl max-w-sm font-light tracking-wide"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Never attend alone again.
          </motion.p>
          <motion.p
            className="text-white/60 text-center text-sm max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Find your perfect tag along for every moment.
          </motion.p>
        </motion.div>

        <motion.div
          className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-[#EA580C] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          style={{ transformOrigin: "center" }}
        />
      </motion.div>
    </div>
  );
}
