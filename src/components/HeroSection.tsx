import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCategoryModal } from "@/components/EventCategoryModal";
import heroImage from "@/assets/hero-events.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const [companionModalOpen, setCompanionModalOpen] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="People enjoying events together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium text-white mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              Never go to an event alone again
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6 text-white"
          >
            Find Your{" "}
            <span className="gradient-text">Tag along</span>
            <br />
            For Every Event
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg"
          >
            Got a ticket but no company? Match with verified companions who share
            your vibe. Concerts, weddings, movies, festivals — enjoy every moment together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Button
              size="lg"
              className="text-base px-8 gap-2"
              onClick={() => setCompanionModalOpen(true)}
            >
              Find Your Companion <ArrowRight className="w-4 h-4" />
            </Button>
            <EventCategoryModal open={companionModalOpen} onOpenChange={setCompanionModalOpen} />
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8"
              onClick={() => navigate("/host-event")}
            >
              Join me
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
