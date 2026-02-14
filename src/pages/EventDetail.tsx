import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getEventById } from "@/lib/events-data";
import { getHostedEventById, closeHostedEvent } from "@/lib/hosted-events";
import { addRequest, hasRequestFromTo } from "@/lib/team-up-requests";
import { addJoinRequest, hasPendingJoinRequest } from "@/lib/join-requests";
import { addMessage } from "@/lib/chat-storage";
import { getUserDisplay } from "@/lib/user-display";
import { cn } from "@/lib/utils";

const HOSTED_PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [confirmTarget, setConfirmTarget] = useState<{
    username: string;
    name: string;
    avatar: string;
  } | null>(null);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const [joinRequestSent, setJoinRequestSent] = useState(false);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const mockEvent = id ? getEventById(id) : undefined;
  const hostedEvent = id ? getHostedEventById(id) : undefined;
  void refresh; // force re-read when host closes event
  const event = mockEvent ?? (hostedEvent ? {
    id: hostedEvent.id,
    name: hostedEvent.name,
    date: hostedEvent.date,
    location: hostedEvent.location,
    image: HOSTED_PLACEHOLDER_IMAGE,
    category: hostedEvent.category,
    peopleLooking: hostedEvent.capacity - hostedEvent.joinedUserIds.length,
    interestedUsers: [],
  } : undefined);
  const isHosted = !!hostedEvent;
  const isHost = user && hostedEvent && hostedEvent.hostUsername === user.username;

  useEffect(() => {
    if (user && hostedEvent && hasPendingJoinRequest(user.username, hostedEvent.hostUsername, hostedEvent.id)) {
      setJoinRequestSent(true);
    }
  }, [user?.username, hostedEvent?.id, hostedEvent?.hostUsername]);

  const handleTeamUp = (username: string, name: string, avatar: string) => {
    setConfirmTarget({ username, name, avatar });
  };

  const handleSendRequest = () => {
    if (!user || !event || !confirmTarget) return;
    if (hasRequestFromTo(user.username, confirmTarget.username, event.id)) {
      setConfirmTarget(null);
      return;
    }
    addRequest(user.username, confirmTarget.username, event.id, event.name, event.date);
    setSentTo((prev) => new Set(prev).add(confirmTarget.username));
    setConfirmTarget(null);
  };

  const handleRequestToJoin = () => {
    setShowJoinConfirm(true);
  };

  const confirmRequestToJoin = () => {
    if (!user || !hostedEvent) return;
    addJoinRequest(user.username, hostedEvent.hostUsername, hostedEvent.id, hostedEvent.name);
    setJoinRequestSent(true);
    setShowJoinConfirm(false);
  };

  const alreadyJoined = user && hostedEvent && hostedEvent.joinedUserIds.includes(user.username);
  const canRequestJoin = user && hostedEvent && !isHost && !alreadyJoined && !joinRequestSent &&
    hostedEvent.status === "open" &&
    (hostedEvent.joinedUserIds.length < hostedEvent.capacity);

  const handleCloseEvent = () => {
    if (!user || !hostedEvent || hostedEvent.hostUsername !== user.username) return;
    closeHostedEvent(hostedEvent.id, user.username);
    setRefresh((r) => r + 1);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 py-8">
          <p className="text-gray-400">Event not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-6 max-w-2xl pb-24">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Event banner & info */}
        <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/80 mb-6">
          <div className="relative h-48">
            <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            {isHosted && (
              <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                Hosted event
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h1 className="text-xl font-bold text-white">{event.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                  {hostedEvent && ` at ${hostedEvent.time}`}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </span>
              </div>
              {hostedEvent && (
                <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-400">
                  <Users className="w-4 h-4 text-primary" />
                  {hostedEvent.joinedUserIds.length}/{hostedEvent.capacity} joined
                  {hostedEvent.description && (
                    <span className="block mt-2 text-gray-300">{hostedEvent.description}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hosted: host profile + Request to Join */}
        {isHosted && hostedEvent && (
          <>
            <h2 className="text-lg font-semibold text-white mb-3">Hosted by</h2>
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/80 mb-6">
              <Avatar className="h-14 w-14 shrink-0">
                <AvatarImage src={getUserDisplay(hostedEvent.hostUsername).avatar} alt="" />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {getUserDisplay(hostedEvent.hostUsername).name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">@{hostedEvent.hostUsername}</p>
                <p className="text-gray-400 text-sm">{getUserDisplay(hostedEvent.hostUsername).name}</p>
              </div>
              {canRequestJoin && (
                <Button
                  className="bg-primary hover:bg-primary/90 shrink-0"
                  onClick={handleRequestToJoin}
                >
                  Request to Join
                </Button>
              )}
              {joinRequestSent && !alreadyJoined && (
                <span className="text-sm text-gray-400 shrink-0">Request sent</span>
              )}
              {alreadyJoined && (
                <span className="text-sm text-primary shrink-0">You&apos;re in</span>
              )}
              {isHost && hostedEvent.status === "open" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-gray-500 text-gray-400 hover:text-white"
                  onClick={handleCloseEvent}
                >
                  Close event
                </Button>
              )}
              {isHost && hostedEvent.status === "closed" && (
                <span className="text-sm text-gray-500 shrink-0">Event closed</span>
              )}
            </div>
            {hostedEvent.status === "closed" && (
              <p className="text-sm text-gray-500 mb-4">This event is no longer accepting join requests.</p>
            )}
            {hostedEvent.status === "open" && (
              <p className="text-sm text-gray-500 mb-4">
                Join requests appear in your Notifications. Accept to add them and start chatting.
              </p>
            )}
          </>
        )}

        {/* Mock event: People interested */}
        {!isHosted && mockEvent && (
          <>
            <h2 className="text-lg font-semibold text-white mb-3">People interested</h2>
            <p className="text-sm text-gray-400 mb-4">
              People attending and looking for company — team up and plan together.
            </p>
            <div className="grid gap-4">
              {mockEvent.interestedUsers.map((person) => {
                const alreadySent = sentTo.has(person.username) ||
                  (user && hasRequestFromTo(user.username, person.username, mockEvent.id));
                return (
                  <div
                    key={person.username}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/80",
                      "hover:border-primary/30 transition-colors",
                    )}
                  >
                    <Avatar className="h-14 w-14 shrink-0">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {person.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">@{person.username}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {person.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 shrink-0"
                      disabled={alreadySent || person.username === user?.username}
                      onClick={() => handleTeamUp(person.username, person.name, person.avatar)}
                    >
                      {alreadySent ? "Request sent" : "Team Up"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Confirm send request */}
      <Dialog open={!!confirmTarget} onOpenChange={() => setConfirmTarget(null)}>
        <DialogContent className="border-border bg-card text-foreground rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              Send request to join this event together?
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-400 text-sm">
            {confirmTarget && (
              <>
                Your team-up request will be sent to @{confirmTarget.username}. They’ll get a
                notification and can accept to start chatting.
              </>
            )}
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleSendRequest}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm request to join (hosted event) */}
      <Dialog open={showJoinConfirm} onOpenChange={setShowJoinConfirm}>
        <DialogContent className="border-border bg-card text-foreground rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              Send request to join this event?
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-400 text-sm">
            The host will get a notification and can accept to add you and start chatting.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowJoinConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRequestToJoin}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetail;
