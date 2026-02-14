import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, ArrowLeft, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  getMessages,
  addMessage,
  getConversationList,
  type ChatMessage,
} from "@/lib/chat-storage";
import { cn } from "@/lib/utils";

const DEFAULT_GREETING = "Hey! I saw you're going to the event. Can I join you?";

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Mock display names/avatars for list (when not from notification)
const MOCK_USERS: Record<string, { name: string; avatar: string }> = {
  rahul: { name: "Rahul", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
  sneha: { name: "Sneha", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" },
  priya: { name: "Priya", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
  ananya: { name: "Ananya", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" },
  vikram: { name: "Vikram", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" },
};

interface ChatLocationState {
  openWith?: string;
  userName?: string;
  userAvatar?: string;
  eventName?: string;
  eventDate?: string;
  fromNotifications?: boolean;
}

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as ChatLocationState) || {};
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const openWith = state.openWith;
  const userName = state.userName ?? MOCK_USERS[openWith ?? ""]?.name ?? openWith ?? "";
  const userAvatar = state.userAvatar ?? MOCK_USERS[openWith ?? ""]?.avatar ?? "";
  const eventName = state.eventName ?? "Event";
  const eventDate = state.eventDate ?? "";

  const isConversationView = Boolean(openWith && user);
  const greetingAddedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !openWith) return;
    let msgs = getMessages(openWith, user.username);
    if (msgs.length === 0 && greetingAddedRef.current !== openWith) {
      greetingAddedRef.current = openWith;
      const greeting = (eventName && eventName !== "Event")
        ? `Hey! I saw you're going to ${eventName}. Can I join you?`
        : DEFAULT_GREETING;
      addMessage(openWith, user.username, openWith, greeting);
      msgs = getMessages(openWith, user.username);
    }
    setMessages(msgs);
  }, [user?.username, openWith, eventName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !user || !openWith) return;
    const next = addMessage(openWith, user.username, user.username, text);
    setMessages(next);
    setInput("");
  };

  const conversationList = user ? getConversationList(user.username) : [];

  if (!user) return null;

  // Conversation view (single chat)
  if (isConversationView) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="pt-16 flex flex-col flex-1 max-h-screen">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-card/80">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-gray-400 hover:text-white"
              onClick={() => (state.fromNotifications ? navigate("/notifications") : navigate("/chat", { state: {} }))}
              aria-label={state.fromNotifications ? "Back to Notifications" : "Back to chats"}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">@{openWith}</p>
              <p className="text-xs text-gray-500 truncate">
                {eventName}
                {eventDate ? ` • ${eventDate}` : ""}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => {
              const isMe = m.from === user.username;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    isMe ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-gray-200 rounded-bl-md border border-border/50",
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>
                    <p className={cn("text-xs mt-1", isMe ? "text-primary-foreground/80" : "text-gray-500")}>
                      {formatTime(m.time)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50 bg-card/80">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                size="icon"
                className="shrink-0 rounded-xl bg-primary hover:bg-primary/90"
                onClick={sendMessage}
                disabled={!input.trim()}
                aria-label="Send"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view (all chats)
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-8 max-w-2xl pb-24">
        <h1 className="text-2xl font-bold text-white mb-1">Chats</h1>
        <p className="text-gray-400 text-sm mb-6">Your conversations</p>

        <div className="space-y-1">
          {conversationList.map((c) => {
            const displayName = MOCK_USERS[c.username]?.name ?? c.username;
            const avatar = MOCK_USERS[c.username]?.avatar ?? "";
            return (
              <button
                key={c.username}
                type="button"
                className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-colors hover:bg-secondary/50 border border-transparent hover:border-border"
                onClick={() =>
                  navigate("/chat", {
                    state: {
                      openWith: c.username,
                      userName: displayName,
                      userAvatar: avatar,
                      eventName: "Event",
                      eventDate: "",
                    },
                  })
                }
              >
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={avatar} alt={displayName} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-white">@{c.username}</span>
                  <p className="text-sm text-gray-400 truncate mt-0.5">{c.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-500 shrink-0">
                  {formatTime(c.lastTime)}
                </span>
              </button>
            );
          })}
        </div>

        {conversationList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageCircle className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-gray-400">No chats yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Go to Notifications and tap &quot;I'm Interested&quot; to start a conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
