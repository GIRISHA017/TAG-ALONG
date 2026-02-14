const STORAGE_KEY = "tagalong_team_requests";

export interface TeamUpRequest {
  id: string;
  fromUsername: string;
  toUsername: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  status: "pending" | "accepted" | "ignored";
  createdAt: number;
}

function load(): TeamUpRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(requests: TeamUpRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function addRequest(
  fromUsername: string,
  toUsername: string,
  eventId: string,
  eventName: string,
  eventDate: string,
): TeamUpRequest {
  const requests = load();
  const id = "req_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
  const req: TeamUpRequest = {
    id,
    fromUsername,
    toUsername,
    eventId,
    eventName,
    eventDate,
    status: "pending",
    createdAt: Date.now(),
  };
  requests.push(req);
  save(requests);
  return req;
}

export function getPendingRequestsForUser(username: string): TeamUpRequest[] {
  return load().filter((r) => r.toUsername === username && r.status === "pending");
}

export function acceptRequest(requestId: string): TeamUpRequest | null {
  const requests = load();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return null;
  requests[idx].status = "accepted";
  save(requests);
  return requests[idx];
}

export function ignoreRequest(requestId: string): void {
  const requests = load();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return;
  requests[idx].status = "ignored";
  save(requests);
}

export function hasRequestFromTo(
  fromUsername: string,
  toUsername: string,
  eventId: string,
): boolean {
  return load().some(
    (r) =>
      r.fromUsername === fromUsername &&
      r.toUsername === toUsername &&
      r.eventId === eventId &&
      r.status === "pending",
  );
}
