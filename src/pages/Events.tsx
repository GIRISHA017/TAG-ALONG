import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";

const allEvents = [
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
  {
    title: "College Reunion Dinner",
    category: "Social",
    date: "Mar 28, 2026",
    location: "Taj Falaknuma Palace",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80",
    interested: 8,
  },
  {
    title: "Stand-up Comedy Night",
    category: "Comedy",
    date: "Apr 2, 2026",
    location: "The Moonshine Project",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&q=80",
    interested: 18,
  },
  {
    title: "Tomorrowland Watch Party",
    category: "Festival",
    date: "Apr 12, 2026",
    location: "Club XS, Jubilee Hills",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    interested: 34,
  },
];

const categories = ["All", "Concert", "Movie", "Festival", "Social", "Comedy"];

const EventsPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = allEvents.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-2">
              Explore <span className="gradient-text">Events</span>
            </h1>
            <p className="text-muted-foreground text-lg">Find events and match with companions.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <EventCard key={event.title} {...event} delay={i * 0.05} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No events found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
