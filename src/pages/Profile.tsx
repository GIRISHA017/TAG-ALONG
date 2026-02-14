import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Pencil, Calendar, MapPin, Settings, Shield, LogOut, Camera } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getProfile,
  setProfile,
  INTEREST_OPTIONS,
  type ProfileData,
  type SharedEvent,
} from "@/lib/profile-storage";
import { getHostedEventsByHost } from "@/lib/hosted-events";
import { getCategoryLabel } from "@/lib/events-data";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfileState] = useState<ProfileData>({ interests: [], sharedEvents: [] });
  const [editingBio, setEditingBio] = useState(false);
  const [editingFullName, setEditingFullName] = useState(false);
  const [bioText, setBioText] = useState("");
  const [fullName, setFullName] = useState("");
  const [fullNameInput, setFullNameInput] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    const data = getProfile(user.username);
    setProfileState(data);
    setBioText(data.bio ?? "");
    setFullName(data.fullName ?? "");
    setFullNameInput(data.fullName ?? "");
  }, [user, navigate]);

  const saveProfile = (updates: Partial<ProfileData>) => {
    if (!user) return;
    const next = { ...profile, ...updates };
    setProfileState(next);
    setProfile(user.username, next);
  };

  const toggleInterest = (interest: string) => {
    const next = profile.interests.includes(interest)
      ? profile.interests.filter((i) => i !== interest)
      : [...profile.interests, interest];
    saveProfile({ interests: next });
  };

  const saveBio = () => {
    saveProfile({ bio: bioText });
    setEditingBio(false);
  };

  const saveFullName = () => {
    const trimmed = fullNameInput.trim();
    setFullName(trimmed || "");
    saveProfile({ fullName: trimmed || undefined });
    setEditingFullName(false);
  };

  const cancelEditFullName = () => {
    setFullNameInput(fullName || "");
    setEditingFullName(false);
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      saveProfile({ profileImageUrl: dataUrl });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  const mockSharedEvents: SharedEvent[] =
    profile.sharedEvents.length > 0
      ? profile.sharedEvents
      : [
          {
            id: "1",
            eventName: "Arijit Singh Live in Hyderabad",
            date: "Mar 15, 2026",
            location: "Hitex Exhibition Centre",
            status: "Looking for companion",
          },
          {
            id: "2",
            eventName: "Marvel Movie Marathon",
            date: "Mar 20, 2026",
            location: "PVR IMAX, Banjara Hills",
            status: "Joined",
          },
        ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-8 max-w-2xl pb-24">
        {/* Top Profile Header */}
        <Card className="border-border/50 bg-card/80 overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5" />
          <CardContent className="relative pt-0 px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="relative shrink-0 group">
                <Avatar className="h-24 w-24 rounded-full border-4 border-background shadow-lg">
                  <AvatarImage src={profile.profileImageUrl} alt={user.username} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoChange}
                  aria-label="Upload profile photo"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                  title="Change profile photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-primary font-medium text-sm">@{user.username}</p>
                {editingFullName ? (
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={fullNameInput}
                      onChange={(e) => setFullNameInput(e.target.value)}
                      className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary w-full max-w-xs"
                      autoFocus
                    />
                    <Button size="sm" onClick={saveFullName}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEditFullName}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-lg">
                      {fullName || "No name added yet"}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 text-gray-400 hover:text-primary"
                      onClick={() => {
                        setFullNameInput(fullName || "");
                        setEditingFullName(true);
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      {fullName ? "Edit" : "Add full name"}
                    </Button>
                  </div>
                )}
                {editingBio ? (
                  <div className="mt-2">
                    <textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      placeholder="Love concerts, movies & travel..."
                      rows={2}
                      className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary"
                    />
                    <Button size="sm" className="mt-2" onClick={saveBio}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">
                    {profile.bio || (
                      <button
                        type="button"
                        onClick={() => setEditingBio(true)}
                        className="text-primary hover:underline"
                      >
                        Add a short bio (e.g. Love concerts, movies & travel)
                      </button>
                    )}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 gap-2 border-border text-gray-300 hover:text-white hover:bg-secondary/50"
                  onClick={() => setEditingBio(true)}
                >
                  <Pencil className="w-4 h-4" /> Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Vibes / Interests */}
        <Card className="border-border/50 bg-card/80 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <span className="text-primary">My Vibes</span>
            </CardTitle>
            <p className="text-sm text-gray-400">
              Your interests help match you with like-minded companions.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = profile.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    title={selected ? "Click to remove" : "Click to add"}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      selected
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary/50 text-gray-400 border border-border hover:border-primary/50 hover:text-white",
                    )}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* My Hosted Events */}
        {user && getHostedEventsByHost(user.username).length > 0 && (
          <Card className="border-border/50 bg-card/80 mb-6">
            <CardHeader>
              <CardTitle className="text-white text-lg">My Hosted Events</CardTitle>
              <p className="text-sm text-gray-400">Events you created — manage requests in Notifications.</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {getHostedEventsByHost(user.username).map((event) => (
                  <Link
                    key={event.id}
                    to={`/event/${event.id}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{event.name}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {event.date} at {event.time}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          {event.location}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{getCategoryLabel(event.category)}</p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 px-3 py-1 rounded-full text-xs font-medium",
                        event.status === "open"
                          ? "bg-primary/20 text-primary"
                          : "bg-gray-500/20 text-gray-400",
                      )}
                    >
                      {event.joinedUserIds.length}/{event.capacity} joined · {event.status === "open" ? "Open" : "Closed"}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shared Plans / My Events */}
        <Card className="border-border/50 bg-card/80 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">My Events</CardTitle>
            <p className="text-sm text-gray-400">Events you've shared or joined.</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {mockSharedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{event.eventName}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 px-3 py-1 rounded-full text-xs font-medium",
                      event.status === "Looking for companion"
                        ? "bg-primary/20 text-primary"
                        : "bg-green-500/20 text-green-400",
                    )}
                  >
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Section */}
        <Card className="border-border/50 bg-card/80 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-secondary/50"
            >
              <Settings className="w-4 h-4" /> Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-secondary/50"
            >
              <Shield className="w-4 h-4" /> Privacy
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            className="w-full max-w-xs border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" /> Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
