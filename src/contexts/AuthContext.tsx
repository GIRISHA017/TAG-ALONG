import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  approveNewDevice as storageApproveNewDevice,
  getOrCreateDeviceId,
  getUser,
  incrementFailedAttempts,
  isLockedOut,
  isPendingDeviceApproval,
  logout as storageLogout,
  setLockout,
  setPendingDeviceApproval,
  setUser as storageSetUser,
  type StoredUser,
} from "@/lib/auth-storage";
import {
  findUserByEmailOrUsername,
  checkPassword as registryCheckPassword,
  registerUser,
  isUsernameTaken,
} from "@/lib/user-registry";

type AuthState = "splash" | "login" | "register" | "forgot_password" | "lockout" | "new_device_pending" | "authenticated";

interface AuthContextValue {
  user: StoredUser | null;
  authState: AuthState;
  isLockedOut: boolean;
  isPendingApproval: boolean;
  login: (emailOrUsername: string, password: string) => { success: boolean; needsApproval?: boolean; error?: string };
  loginWithFingerprint: () => Promise<boolean>;
  register: (data: { email: string; mobile: string; username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  checkUsername: (username: string) => Promise<boolean>;
  logout: () => void;
  approveNewDevice: () => void;
  setAuthState: (state: AuthState) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<StoredUser | null>(() => getUser());
  const [authState, setAuthState] = useState<AuthState>(() => {
    if (getUser()) return "authenticated";
    if (isLockedOut()) return "lockout";
    if (isPendingDeviceApproval()) return "new_device_pending";
    return "splash";
  });

  const isLockedOutState = isLockedOut();
  const isPendingApproval = isPendingDeviceApproval();

  const login = useCallback(
    (emailOrUsername: string, password: string): { success: boolean; needsApproval?: boolean; error?: string } => {
      if (isLockedOut()) {
        return { success: false, error: "Account temporarily locked." };
      }
      const registered = findUserByEmailOrUsername(emailOrUsername);
      if (!registered || !registryCheckPassword(registered, password)) {
        const attempts = incrementFailedAttempts();
        if (attempts >= 2) {
          setLockout();
          setAuthState("lockout");
          return { success: false, error: "Too many failed attempts. App locked for 3 hours." };
        }
        return { success: false, error: "Invalid email/username or password." };
      }
      const deviceId = getOrCreateDeviceId();
      const stored = getUser();
      if (stored && (stored as StoredUser & { deviceId?: string }).deviceId && (stored as StoredUser & { deviceId?: string }).deviceId !== deviceId) {
        setPendingDeviceApproval(true);
        setAuthState("new_device_pending");
        return { success: false, needsApproval: true, error: "New device detected. Check your email to approve login." };
      }
      const userForSession: StoredUser = { email: registered.email, username: registered.username, mobile: registered.mobile };
      storageSetUser(userForSession, deviceId);
      setUserState(userForSession);
      setAuthState("authenticated");
      return { success: true };
    },
    [],
  );

  const loginWithFingerprint = useCallback(async (): Promise<boolean> => {
    if (isLockedOut()) return false;
    // In production: Web Authn / biometric API
    const deviceId = getOrCreateDeviceId();
    const stored = getUser();
    if (!stored) return false;
    if ((stored as StoredUser & { deviceId?: string }).deviceId !== deviceId) {
      setPendingDeviceApproval(true);
      setAuthState("new_device_pending");
      return false;
    }
    storageSetUser(stored, deviceId);
    setUserState(stored);
    setAuthState("authenticated");
    return true;
  }, []);

  const register = useCallback(
    async (data: { email: string; mobile: string; username: string; password: string }): Promise<{ success: boolean; error?: string }> => {
      if (isUsernameTaken(data.username)) {
        return { success: false, error: "This username is already taken." };
      }
      registerUser({
        email: data.email.trim(),
        mobile: data.mobile.trim(),
        username: data.username.trim(),
        password: data.password,
      });
      // Redirect to login so user signs in with new credentials (no auto-login)
      setAuthState("login");
      return { success: true };
    },
    [],
  );

  const checkUsername = useCallback(async (username: string): Promise<boolean> => {
    if (!username || username.trim().length < 3) return false;
    await new Promise((r) => setTimeout(r, 300));
    return !isUsernameTaken(username.trim());
  }, []);

  const logout = useCallback(() => {
    storageLogout();
    setUserState(null);
    setAuthState("login");
  }, []);

  const approveNewDevice = useCallback(() => {
    storageApproveNewDevice();
    setUserState(getUser());
    setAuthState("authenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authState,
      isLockedOut: isLockedOutState,
      isPendingApproval,
      login,
      loginWithFingerprint,
      register,
      checkUsername,
      logout,
      approveNewDevice,
      setAuthState,
    }),
    [user, authState, isLockedOutState, isPendingApproval, login, loginWithFingerprint, register, checkUsername, logout, approveNewDevice],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
