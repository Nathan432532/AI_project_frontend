import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuthUser {
  userName: string;
  firstName: string; // voor "Welkom, Jan" in HomePage
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTokenFromStorage(): string | null {
  // Probeer eerst localStorage, dan cookie
  const fromLocal = localStorage.getItem("token");
  if (fromLocal) return fromLocal;

  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function parseJWT(token: string): Record<string, string> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function extractUser(token: string): AuthUser | null {
  const payload = parseJWT(token);
  if (!payload) return null;

  // Pas de veldnamen aan op wat jouw backend in de token zet
  const fullName =
    payload.name ??
    payload.full_name ??
    `${payload.given_name ?? ""} ${payload.family_name ?? ""}`.trim() ??
    payload.username ??
    payload.sub ??
    "Gebruiker";

  const firstName =
    payload.given_name ??
    payload.first_name ??
    fullName.split(" ")[0];

  return { userName: fullName, firstName };
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getTokenFromStorage();
    if (token) {
      setUser(extractUser(token));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/";
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  return useContext(AuthContext);
}
