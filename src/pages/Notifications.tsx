import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  getPendingRequestsForUser,
  acceptRequest,
  ignoreRequest,
  type TeamUpRequest,
} from "@/lib/team-up-requests";
import {
  getJoinRequestsForHost,
  acceptJoinRequest,
  ignoreJoinRequest,
  type JoinRequest,
} from "@/lib/join-requests";
import { addJoinedUser } from "@/lib/hosted-events";
import { getUserDisplay } from "@/lib/user-display";
import { addMessage } from "@/lib/chat-storage";

export interface NotificationTarget {
  id: string;
  username: string;
  userName: string;
  userAvatar: string;
  eventName: string;
  eventDate: string;
  messagePreview: string;
  time: string;
}

const mockInterestNotifications: NotificationTarget[] = [
  {
    id: "1",
    username: "rahul",
    userName: "Rahul",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    eventName: "Coldplay Concert",
    eventDate: "Jan 20",
    messagePreview: "Rahul is interested in joining your concert plan",
    time: "5 min ago",
  },
  {
    id: "2",
    username: "sneha",
    userName: "Sneha",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    eventName: "Movie Night",
    eventDate: "Jan 22",
    messagePreview: "Sneha sent a request to tag along for Movie Night",
    time: "2 hours ago",
  },
];

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interestNotifications, setInterestNotifications] = useState<NotificationTarget[]>(mockInterestNotifications);
  const [ignoredIds, setIgnoredIds] = useState<Set<string>>(new Set());
  const [teamUpRequests, setTeamUpRequests] = useState<TeamUpRequest[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  useEffect(() => {
    if (user) {
      setTeamUpRequests(getPendingRequestsForUser(user.username));
      setJoinRequests(getJoinRequestsForHost(user.username));
    }
  }, [user?.username]);

  const handleInterested = (n: NotificationTarget) => {
    navigate("/chat", {
      state: {
        openWith: n.username,
        userName: n.userName,
        userAvatar: n.userAvatar,
        eventName: n.eventName,
        eventDate: n.eventDate,
        fromNotifications: true,
      },
    });
  };

  const handleIgnoreInterest = (id: string) => {
    setIgnoredIds((prev) => new Set(prev).add(id));
  };

  const handleAcceptTeamUp = (req: TeamUpRequest) => {
    if (!user) return;
    const accepted = acceptRequest(req.id);
    if (accepted) {
      const greeting = `Hey! I'd love to team up for ${req.eventName}. Are you still going?`;
      addMessage(req.fromUsername, user.username, req.fromUsername, greeting);
      setTeamUpRequests((prev) => prev.filter((r) => r.id !== req.id));
      const display = getUserDisplay(req.fromUsername);
      navigate("/chat", {
        state: {
          openWith: req.fromUsername,
          userName: display.name,
          userAvatar: display.avatar,
          eventName: req.eventName,
          eventDate: req.eventDate,
          fromNotifications: true,
        },
      });
    }
  };

  const handleIgnoreTeamUp = (requestId: string) => {
    ignoreRequest(requestId);
    setTeamUpRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const handleAcceptJoinRequest = (req: JoinRequest) => {
    const accepted = acceptJoinRequest(req.id);
    if (accepted) {
      addJoinedUser(req.eventId, req.fromUsername);
      setJoinRequests((prev) => prev.filter((r) => r.id !== req.id));
      const greeting = `Hi! I'd love to join your event "${req.eventName}".`;
      addMessage(req.fromUsername, req.hostUsername, req.fromUsername, greeting);
      const display = getUserDisplay(req.fromUsername);
      navigate("/chat", {
        state: {
          openWith: req.fromUsername,
          userName: display.name,
          userAvatar: display.avatar,
          eventName: req.eventName,
          fromNotifications: true,
        },
      });
    }
  };

  const handleIgnoreJoinRequest = (requestId: string) => {
    ignoreJoinRequest(requestId);
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const visibleInterest = interestNotifications.filter((n) => !ignoredIds.has(n.id));
  const hasAny = visibleInterest.length > 0 || teamUpRequests.length > 0 || joinRequests.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-6 max-w-2xl pb-24">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-secondary/50 transition-colors"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            <p className="text-gray-400 text-sm">Stay updated with who wants to tag along</p>
          </div>
        </div>

        {/* Join requests for your hosted events */}
        {joinRequests.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Join requests for your events
            </h2>
            <div className="space-y-4">
              {joinRequests.map((req) => {
                const display = getUserDisplay(req.fromUsername);
                return (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-primary/30 bg-primary/5 p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarImage src={display.avatar} alt={display.name} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {display.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-primary font-medium text-sm">@{req.fromUsername}</p>
                        <p className="text-white text-sm mt-0.5">
                          wants to join your event &quot;{req.eventName}&quot;
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => handleAcceptJoinRequest(req)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border text-gray-400 hover:text-white"
                            onClick={() => handleIgnoreJoinRequest(req.id)}
                          >
                            Ignore
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Team-up requests (from Find Your Companion flow) */}
        {teamUpRequests.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Team-up requests
            </h2>
            <div className="space-y-4">
              {teamUpRequests.map((req) => {
                const display = getUserDisplay(req.fromUsername);
                return (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-primary/30 bg-primary/5 p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarImage src={display.avatar} alt={display.name} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {display.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-primary font-medium text-sm">@{req.fromUsername}</p>
                        <p className="text-white text-sm mt-0.5">
                          wants to team up with you for {req.eventName}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                            onClick={() => handleAcceptTeamUp(req)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border text-gray-400 hover:text-white"
                            onClick={() => handleIgnoreTeamUp(req.id)}
                          >
                            Ignore
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Interest notifications */}
        {visibleInterest.length > 0 && (
          <section>
            {teamUpRequests.length > 0 && (
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Interest in your events
              </h2>
            )}
            <div className="space-y-4">
              {visibleInterest.map((n) => (
                <div
                  key={n.id}
                  className="rounded-2xl border border-border/50 bg-card/80 p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={n.userAvatar} alt={n.userName} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {n.userName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-primary font-medium text-sm">@{n.username}</p>
                      <p className="text-white text-sm mt-0.5">{n.messagePreview}</p>
                      <p className="text-gray-500 text-xs mt-1">{n.eventName}</p>
                      <p className="text-gray-500 text-xs mt-2">{n.time}</p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleInterested(n)}
                        >
                          I'm Interested
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border text-gray-400 hover:text-white"
                          onClick={() => handleIgnoreInterest(n.id)}
                        >
                          Ignore
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!hasAny && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-gray-400">No notifications yet</p>
            <p className="text-sm text-gray-500 mt-1">
              When someone is interested in your event or wants to team up, they'll show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
