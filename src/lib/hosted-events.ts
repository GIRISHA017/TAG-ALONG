import type { CategoryId } from "./events-data";

const STORAGE_KEY = "tagalong_hosted_events";

export type WhoJoin = "same_taste" | "friendly" | "first_time" | "any";

export interface HostedEvent {
  id: string;
  hostUsername: string;
  category: CategoryId;
  name: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  description?: string;
  whoJoin?: WhoJoin;
  interestTags: string[];
  status: "open" | "closed";
  joinedUserIds: string[];
  createdAt: number;
}

function load(): HostedEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(events: HostedEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function createHostedEvent(
  hostUsername: string,
  data: Omit<HostedEvent, "id" | "hostUsername" | "joinedUserIds" | "createdAt" | "status">,
): HostedEvent {
  const events = load();
  const id = "host_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
  const event: HostedEvent = {
    ...data,
    id,
    hostUsername,
    joinedUserIds: [],
    status: "open",
    createdAt: Date.now(),
  };
  events.push(event);
  save(events);
  return event;
}

export function getHostedEventsByCategory(category: CategoryId): HostedEvent[] {
  return load().filter((e) => e.category === category && e.status === "open");
}

export function getHostedEventById(id: string): HostedEvent | undefined {
  return load().find((e) => e.id === id);
}

export function getHostedEventsByHost(hostUsername: string): HostedEvent[] {
  return load().filter((e) => e.hostUsername === hostUsername);
}

export function addJoinedUser(eventId: string, username: string): boolean {
  const events = load();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return false;
  if (events[idx].joinedUserIds.includes(username)) return true;
  if (events[idx].joinedUserIds.length >= events[idx].capacity) return false;
  events[idx].joinedUserIds.push(username);
  save(events);
  return true;
}

export function closeHostedEvent(eventId: string, hostUsername: string): boolean {
  const events = load();
  const idx = events.findIndex((e) => e.id === eventId && e.hostUsername === hostUsername);
  if (idx === -1) return false;
  events[idx].status = "closed";
  save(events);
  return true;
}
