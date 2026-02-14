const PROFILE_KEY_PREFIX = "tagalong_profile_";

export interface SharedEvent {
  id: string;
  eventName: string;
  date: string;
  location: string;
  status: "Looking for companion" | "Joined";
}

export interface ProfileData {
  fullName?: string;
  bio?: string;
  profileImageUrl?: string;
  interests: string[];
  sharedEvents: SharedEvent[];
}

const DEFAULT_INTEREST_OPTIONS = [
  "Concerts",
  "Music Festivals",
  "Movies",
  "Travel",
  "Food Events",
  "Tech Events",
  "Workshops",
] as const;

export const INTEREST_OPTIONS: string[] = [...DEFAULT_INTEREST_OPTIONS];

const defaultProfile = (): ProfileData => ({
  interests: [],
  sharedEvents: [],
});

export function getProfile(username: string): ProfileData {
  try {
    const raw = localStorage.getItem(PROFILE_KEY_PREFIX + username);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw) as ProfileData;
    return {
      ...defaultProfile(),
      ...parsed,
      interests: Array.isArray(parsed.interests) ? parsed.interests : [],
      sharedEvents: Array.isArray(parsed.sharedEvents) ? parsed.sharedEvents : [],
    };
  } catch {
    return defaultProfile();
  }
}

export function setProfile(username: string, data: ProfileData): void {
  localStorage.setItem(PROFILE_KEY_PREFIX + username, JSON.stringify(data));
}
