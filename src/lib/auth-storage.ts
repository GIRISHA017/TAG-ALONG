const LOCK_UNTIL_KEY = "plusone_lock_until";
const FAILED_ATTEMPTS_KEY = "plusone_failed_attempts";
const DEVICE_ID_KEY = "plusone_device_id";
const USER_KEY = "plusone_user";
const PENDING_APPROVAL_KEY = "plusone_pending_device_approval";
const LOCKOUT_HOURS = 3;
const MAX_ATTEMPTS = 2;

export function getLockUntil(): number | null {
  const v = localStorage.getItem(LOCK_UNTIL_KEY);
  return v ? parseInt(v, 10) : null;
}

export function setLockout(): void {
  const until = Date.now() + LOCKOUT_HOURS * 60 * 60 * 1000;
  localStorage.setItem(LOCK_UNTIL_KEY, String(until));
  localStorage.setItem(FAILED_ATTEMPTS_KEY, "0");
}

export function getFailedAttempts(): number {
  const v = localStorage.getItem(FAILED_ATTEMPTS_KEY);
  return v ? parseInt(v, 10) : 0;
}

export function incrementFailedAttempts(): number {
  const n = getFailedAttempts() + 1;
  localStorage.setItem(FAILED_ATTEMPTS_KEY, String(n));
  if (n >= MAX_ATTEMPTS) {
    setLockout();
  }
  return n;
}

export function clearFailedAttempts(): void {
  localStorage.removeItem(FAILED_ATTEMPTS_KEY);
  localStorage.removeItem(LOCK_UNTIL_KEY);
}

export function isLockedOut(): boolean {
  const until = getLockUntil();
  if (!until) return false;
  if (Date.now() >= until) {
    clearFailedAttempts();
    return false;
  }
  return true;
}

export function getRemainingLockMinutes(): number {
  const until = getLockUntil();
  if (!until || Date.now() >= until) return 0;
  return Math.ceil((until - Date.now()) / 60000);
}

function generateDeviceId(): string {
  return "dev_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getDeviceId(): string | null {
  return localStorage.getItem(DEVICE_ID_KEY);
}

export interface StoredUser {
  email: string;
  username: string;
  mobile: string;
  deviceId?: string;
}

export function setUser(user: StoredUser, deviceId: string): void {
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, deviceId }));
  clearFailedAttempts();
}

export function getUser(): StoredUser | null {
  const v = localStorage.getItem(USER_KEY);
  return v ? (JSON.parse(v) as StoredUser) : null;
}

export function logout(): void {
  localStorage.removeItem(USER_KEY);
}

export function setPendingDeviceApproval(pending: boolean): void {
  if (pending) {
    localStorage.setItem(PENDING_APPROVAL_KEY, "1");
  } else {
    localStorage.removeItem(PENDING_APPROVAL_KEY);
  }
}

export function isPendingDeviceApproval(): boolean {
  return localStorage.getItem(PENDING_APPROVAL_KEY) === "1";
}

export function approveNewDevice(): void {
  const user = getUser();
  if (user) {
    const deviceId = getOrCreateDeviceId();
    setUser(user, deviceId);
  }
  setPendingDeviceApproval(false);
}
