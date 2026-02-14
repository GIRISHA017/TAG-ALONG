import { motion } from "framer-motion";
import { Bell, MessageCircle, Phone, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Post your event and get instant alerts when someone's interested. Only mutual matches connect — no spam, no hassle.",
  },
  {
    icon: MessageCircle,
    title: "In-App Chat",
    description:
      "Chat securely inside the app. Discuss event plans, meet-up spots, and get to know each other — no need to share personal numbers.",
  },
  {
    icon: Phone,
    title: "Voice & Video Calls",
    description:
      "Build trust before you meet. Hop on a quick voice or video call to make sure you're comfortable with your tag along.",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Safe",
    description:
      "OTP verification, selfie checks, and fake ID detection keep the community genuine. Block & report anyone instantly.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const whyTagAlongIntro = `A tag along is the person you bring along to an event — your companion. We're called Tag along because we help you find that person so you never have to show up alone. Whether it's a concert, wedding, movie, or festival, having a tag along makes every moment better. This isn't a dating app: it's about real human connection and sharing experiences with someone you can trust.`;

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4 text-white">
            Why <span className="gradient-text">Tag along</span>?
          </h2>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need for a safe, fun, and seamless companion-matching experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16"
        >
          <p className="text-gray-300 text-base md:text-lg leading-relaxed text-center">
            {whyTagAlongIntro}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold font-display mb-2 text-white">{feature.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
