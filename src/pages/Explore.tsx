import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getEventsByCategory,
  getCategoryLabel,
  type CategoryId,
  type EventItem,
} from "@/lib/events-data";
import { getHostedEventsByCategory } from "@/lib/hosted-events";
import { cn } from "@/lib/utils";

const DEFAULT_HOSTED_IMAGE = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80";

export type ExploreEventItem = EventItem | {
  id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  peopleLooking: number;
  interestedUsers: { username: string; name: string; avatar: string; tags: string[] }[];
  isHosted: true;
  hostUsername: string;
  slotsLeft: number;
  capacity: number;
};

type SortOption = "date" | "location" | "popularity";

function buildExploreList(categoryId: CategoryId): ExploreEventItem[] {
  const listEvents = getEventsByCategory(categoryId);
  const hosted = getHostedEventsByCategory(categoryId).map((h) => ({
    id: h.id,
    name: h.name,
    date: h.date,
    location: h.location,
    image: DEFAULT_HOSTED_IMAGE,
    peopleLooking: h.capacity - h.joinedUserIds.length,
    interestedUsers: [],
    isHosted: true as const,
    hostUsername: h.hostUsername,
    slotsLeft: h.capacity - h.joinedUserIds.length,
    capacity: h.capacity,
  }));
  return [...listEvents, ...hosted];
}

const Explore = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortOption>("date");

  const categoryId = (category ?? "concerts") as CategoryId;
  let events = buildExploreList(categoryId);

  if (sort === "date") {
    events = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sort === "popularity") {
    events = [...events].sort((a, b) => b.peopleLooking - a.peopleLooking);
  } else {
    events = [...events].sort((a, b) => a.location.localeCompare(b.location));
  }

  const isHosted = (e: ExploreEventItem): e is ExploreEventItem & { isHosted: true } =>
    "isHosted" in e && e.isHosted === true;

  const title = getCategoryLabel(categoryId) + " Near You";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-6 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-secondary/50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 text-sm">Find people looking for companions</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort events by"
            className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary"
          >
            <option value="date">Date</option>
            <option value="location">Location</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} showHostedBadge={isHosted(event)} />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>No events in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function EventCard({
  event,
  showHostedBadge,
}: {
  event: ExploreEventItem;
  showHostedBadge: boolean;
}) {
  const subtitle = showHostedBadge
    ? "Hosted event · Join them"
    : `${event.peopleLooking} looking for companions`;
  return (
    <Link
      to={`/event/${event.id}`}
      className={cn(
        "block rounded-2xl border border-border/50 bg-card/80 overflow-hidden",
        "hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5",
      )}
    >
      <div className="relative h-40">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        {showHostedBadge && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            Hosted
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-semibold text-white text-lg truncate">{event.name}</h3>
          <div className="flex items-center gap-3 text-xs text-gray-300 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {event.date}
            </span>
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {event.location}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <Users className="w-4 h-4 text-primary" />
            {subtitle}
          </span>
        </div>
        <div className="flex -space-x-2">
          {event.interestedUsers.slice(0, 3).map((u) => (
            <Avatar key={u.username} className="h-8 w-8 border-2 border-background">
              <AvatarImage src={u.avatar} alt={u.name} />
              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                {u.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default Explore;
