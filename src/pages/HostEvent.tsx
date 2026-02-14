import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORIES, getCategoryLabel, type CategoryId } from "@/lib/events-data";
import { createHostedEvent, type WhoJoin } from "@/lib/hosted-events";
import { cn } from "@/lib/utils";

const HOST_CATEGORIES = CATEGORIES.filter((c) => c.id !== "weddings"); // Concert, Movie, Festival, Travel, Food, Workshop, Other

const WHO_JOIN_OPTIONS: { value: WhoJoin; label: string }[] = [
  { value: "same_taste", label: "Same music taste" },
  { value: "friendly", label: "Friendly & talkative" },
  { value: "first_time", label: "First-time attendees" },
  { value: "any", label: "Any is fine" },
];

const INTEREST_TAGS = ["Music Lover", "Movie Buff", "Traveler", "Foodie", "Adventure", "Chill Vibes"];

const CAPACITY_OPTIONS = [2, 3, 4, 5];

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T12:00:00");
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatDisplayTime(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  if (h === undefined) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m ?? 0).padStart(2, "0")} ${period}`;
}

export default function HostEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [description, setDescription] = useState("");
  const [whoJoin, setWhoJoin] = useState<WhoJoin>("any");
  const [interestTags, setInterestTags] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  const toggleTag = (tag: string) => {
    setInterestTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const canProceedStep1 = category !== null;
  const canProceedStep2 = name.trim() && location.trim() && date && time;

  const handlePublish = () => {
    if (!user || !category) return;
    setPublishing(true);
    const event = createHostedEvent(user.username, {
      category,
      name: name.trim(),
      location: location.trim(),
      date,
      time,
      capacity,
      description: description.trim() || undefined,
      whoJoin,
      interestTags,
    });
    setPublishing(false);
    navigate(`/event/${event.id}`);
  };

  if (!user) return null;

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-6 max-w-xl pb-24">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-secondary/50 transition-colors"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Host an Event</h1>
            <p className="text-gray-400 text-sm">Share your plan and find people to join you</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Step {step} of {totalSteps}</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className={cn(
                "h-full bg-primary rounded-full transition-all duration-300",
                step === 1 && "w-1/4",
                step === 2 && "w-2/4",
                step === 3 && "w-3/4",
                step === 4 && "w-full",
              )}
            />
          </div>
        </div>

        {/* Step 1 – Category */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">Select a category for your event</p>
            <div className="grid grid-cols-2 gap-3">
              {HOST_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 py-6 transition-all",
                    category === cat.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/30 hover:border-primary/50 text-white",
                  )}
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
            <Button
              className="w-full mt-6"
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
            >
              Next
            </Button>
          </div>
        )}

        {/* Step 2 – Event details */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">Event details</p>
            <div className="space-y-2">
              <Label className="text-gray-300">Event name</Label>
              <Input
                placeholder="e.g. Arijit Singh Live Concert"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/50 border-border text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Location (city / venue)</Label>
              <Input
                placeholder="e.g. Hitex Exhibition Centre, Hyderabad"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-secondary/50 border-border text-white placeholder:text-gray-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-gray-300">Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="bg-secondary/50 border-border text-white [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Time</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-secondary/50 border-border text-white [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">How many people can join you?</Label>
              <div className="flex gap-2 flex-wrap">
                {CAPACITY_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setCapacity(n)}
                    className={cn(
                      "w-12 h-12 rounded-lg border-2 font-medium transition-all",
                      capacity === n
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-secondary/30 text-gray-300 hover:border-primary/50",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Short description (optional)</Label>
              <textarea
                placeholder="e.g. Going alone and looking for friendly people to enjoy the concert together."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 – Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <p className="text-gray-300 text-sm">Who would you like to join? This helps attract like-minded people.</p>
            <div className="space-y-2">
              {WHO_JOIN_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                    whoJoin === opt.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/30 hover:border-primary/50",
                  )}
                >
                  <input
                    type="radio"
                    name="whoJoin"
                    value={opt.value}
                    checked={whoJoin === opt.value}
                    onChange={() => setWhoJoin(opt.value)}
                    className="text-primary"
                  />
                  <span className="text-white">{opt.label}</span>
                </label>
              ))}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Interest tags (select any)</Label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      interestTags.includes(tag)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 border border-border text-gray-400 hover:border-primary/50 hover:text-white",
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(4)}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 4 – Publish */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card/80 p-4 space-y-2">
              <p className="text-primary font-medium">{category && getCategoryLabel(category)}</p>
              <h3 className="text-lg font-semibold text-white">{name || "—"}</h3>
              <p className="text-gray-400 text-sm">{location}</p>
              <p className="text-gray-400 text-sm">
                {date ? formatDisplayDate(date) : "—"} {time ? `at ${formatDisplayTime(time)}` : ""}
              </p>
              <p className="text-gray-400 text-sm">Up to {capacity} people can join</p>
              {description && <p className="text-gray-300 text-sm pt-2">{description}</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={publishing}
                onClick={handlePublish}
              >
                {publishing ? "Publishing…" : "Share My Plan"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
