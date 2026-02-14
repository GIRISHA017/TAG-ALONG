import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EventCard from "./EventCard";

const sampleEvents = [
  {
    title: "Arijit Singh Live in Hyderabad",
    category: "Concert",
    date: "Mar 15, 2026",
    location: "Hitex Exhibition Centre",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    interested: 24,
  },
  {
    title: "Marvel Movie Marathon",
    category: "Movie",
    date: "Mar 20, 2026",
    location: "PVR IMAX, Banjara Hills",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    interested: 12,
  },
  {
    title: "Sunburn Festival Goa",
    category: "Festival",
    date: "Apr 5, 2026",
    location: "Vagator Beach, Goa",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80",
    interested: 56,
  },
];

const EventsPreviewSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-2 text-white">
              Trending <span className="gradient-text">Events</span>
            </h2>
            <p className="text-gray-200 text-lg">
              People are looking for companions. Will you join them?
            </p>
          </div>
          <Link to="/events">
            <Button variant="outline" className="gap-2">
              View All Events <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleEvents.map((event, i) => (
            <EventCard key={event.title} {...event} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsPreviewSection;
