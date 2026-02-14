import { motion } from "framer-motion";
import { CalendarPlus, UserCheck, MessageSquare, PartyPopper } from "lucide-react";

const steps = [
  {
    icon: CalendarPlus,
    step: "01",
    title: "Post Your Event",
    description:
      "Add your event details — concert, wedding, movie, festival, or any outing. Tell us what you're looking for in a companion and when and where you're going. Your post is visible to others who are looking for a tag along for the same or similar events.",
  },
  {
    icon: UserCheck,
    step: "02",
    title: "Get Matched",
    description:
      "When someone is interested in being your tag along, you get a notification. You can view their profile and accept or decline. Only mutual interest leads to a connection — no spam, no random messages. You choose who you want to go with.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Chat & Connect",
    description:
      "Once you're matched, use in-app chat to plan the day: where to meet, what to wear, or what to do after the event. You can also do a quick voice or video call to get comfortable before meeting in person. Build trust at your own pace with your tag along.",
  },
  {
    icon: PartyPopper,
    step: "04",
    title: "Enjoy Together!",
    description:
      "Meet up at the event and enjoy it together. No more awkward solo entry, no more missing out because you had no one to go with. After the event, you can leave a review and stay in touch with your tag along for future events.",
  },
];

const howItWorksIntro =
  "Finding a companion for your next event is simple. Follow these four steps from posting your event to enjoying it with your tag along.";

const HowItWorksSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4 text-white">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-gray-200 text-lg max-w-xl mx-auto mb-4">
            Four simple steps to finding your perfect event companion.
          </p>
          <p className="text-gray-300 text-base max-w-2xl mx-auto leading-relaxed">
            {howItWorksIntro}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="text-6xl font-bold font-display text-primary mb-2">
                {s.step}
              </div>
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold font-display mb-2 text-white">{s.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
