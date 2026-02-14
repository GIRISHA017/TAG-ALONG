/**
 * Stores all registered users for login and username uniqueness.
 * In production this would be a backend API.
 */
const REGISTRY_KEY = "tagalong_user_registry";

export interface RegisteredUser {
  email: string;
  username: string;
  mobile: string;
  password: string;
}

function load(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(users: RegisteredUser[]) {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(users));
}

export function isUsernameTaken(username: string): boolean {
  const users = load();
  return users.some((u) => u.username.toLowerCase() === username.toLowerCase());
}

export function isEmailTaken(email: string): boolean {
  const users = load();
  return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function registerUser(data: RegisteredUser): void {
  const users = load();
  if (users.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) return;
  users.push(data);
  save(users);
}

export function findUserByEmailOrUsername(emailOrUsername: string): RegisteredUser | undefined {
  const users = load();
  const key = emailOrUsername.trim().toLowerCase();
  return users.find(
    (u) => u.email.toLowerCase() === key || u.username.toLowerCase() === key,
  );
}

export function checkPassword(user: RegisteredUser, password: string): boolean {
  return user.password === password;
}
