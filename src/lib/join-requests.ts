const STORAGE_KEY = "tagalong_join_requests";

export interface JoinRequest {
  id: string;
  fromUsername: string;
  hostUsername: string;
  eventId: string;
  eventName: string;
  status: "pending" | "accepted" | "ignored";
  createdAt: number;
}

function load(): JoinRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(requests: JoinRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function addJoinRequest(
  fromUsername: string,
  hostUsername: string,
  eventId: string,
  eventName: string,
): JoinRequest {
  const requests = load();
  const id = "join_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
  const req: JoinRequest = {
    id,
    fromUsername,
    hostUsername,
    eventId,
    eventName,
    status: "pending",
    createdAt: Date.now(),
  };
  requests.push(req);
  save(requests);
  return req;
}

export function getJoinRequestsForHost(hostUsername: string): JoinRequest[] {
  return load().filter((r) => r.hostUsername === hostUsername && r.status === "pending");
}

export function acceptJoinRequest(requestId: string): JoinRequest | null {
  const requests = load();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return null;
  requests[idx].status = "accepted";
  save(requests);
  return requests[idx];
}

export function ignoreJoinRequest(requestId: string): void {
  const requests = load();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return;
  requests[idx].status = "ignored";
  save(requests);
}

export function hasPendingJoinRequest(
  fromUsername: string,
  hostUsername: string,
  eventId: string,
): boolean {
  return load().some(
    (r) =>
      r.fromUsername === fromUsername &&
      r.hostUsername === hostUsername &&
      r.eventId === eventId &&
      r.status === "pending",
  );
}

export function hasAcceptedJoinRequest(
  fromUsername: string,
  eventId: string,
): boolean {
  return load().some(
    (r) =>
      r.fromUsername === fromUsername &&
      r.eventId === eventId &&
      r.status === "accepted",
  );
}
