import { motion } from "framer-motion";
import { MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
  interested: number;
  delay?: number;
}

const EventCard = ({ title, category, date, location, image, interested, delay = 0 }: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold gradient-primary text-primary-foreground">
            {category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold font-display mb-3 line-clamp-1 text-white">{title}</h3>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4 text-primary" />
            {date}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin className="w-4 h-4 text-primary" />
            {location}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users className="w-4 h-4 text-primary" />
            {interested} interested
          </div>
        </div>
        <Button className="w-full" size="sm">
          I'm Interested
        </Button>
      </div>
    </motion.div>
  );
};

export default EventCard;
