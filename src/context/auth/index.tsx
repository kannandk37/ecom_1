import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';

import { useUser } from '../user';
import { useRole } from '../role';
import { useProfile } from '../profile';
import { useCart } from '../cart';
import { LocalStorage } from '../../storage';
import { User } from '../../entity/user';
import { Role } from '../../entity/role';
import { Cart } from '../../entity/cart';
import { Profile } from '../../entity/profile';

const ls = new LocalStorage();

interface SignInPayload {
  token: string;
  user: User;
  role: Role;
  profile: Profile;
  cart?: Cart | null;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;  // true while rehydrating on first render
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // true until rehydration done

  const { setUser, clearUser } = useUser();
  const { setRole, clearRole } = useRole();
  const { setProfile, clearProfile } = useProfile();
  const { setCart, clearCart } = useCart();

  // ── Rehydration ─────────────────────────────────────────────────────────────
  // Runs once on mount.
  // Reads each key from localStorage via your LocalStorage class and restores
  // all context values — so the user stays logged in after a page refresh.
  useEffect(() => {
    const rehydrate = async () => {
      try {
        const [token, user, role, profile, cart] = await Promise.all([
          ls.getToken('token'),
          ls.getUser(),
          ls.getRole(),
          ls.getProfile(),
          ls.getCart(),
        ]);

        // Only restore session if the essentials are present
        if (token && user && role && profile) {
          setUser(user);
          setRole(role);
          setProfile(profile);
          if (cart) setCart(cart);
          setIsLoggedIn(true);
        }
      } catch (err) {
        // localStorage unavailable or corrupted — start fresh
        console.warn('Session rehydration failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    rehydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sign In ─────────────────────────────────────────────────────────────────
  // Call this after a successful login / register API response.
  // Saves everything to localStorage via your LocalStorage class,
  // then populates all contexts.
  const signIn = useCallback(
    async ({ token, user, role, profile, cart }: SignInPayload) => {
      try {
        // Persist to localStorage first so rehydration works on refresh
        await Promise.all([
          ls.storeToken(token),
          ls.storeUser(user),
          ls.storeRole(role),
          ls.storeProfile(profile),
          ...(cart ? [ls.storeCart(cart)] : []),
        ]);

        // Then populate all contexts
        setUser(user);
        setRole(role);
        setProfile(profile);
        if (cart) setCart(cart);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Sign in failed to persist session:', err);
      }
    },
    [setUser, setRole, setProfile, setCart]
  );

  // ── Sign Out ────────────────────────────────────────────────────────────────
  // Clears all localStorage keys then resets all contexts.
  const signOut = useCallback(async () => {
    try {
      await Promise.all([
        localStorage.removeItem('token'),
        localStorage.removeItem('user'),
        localStorage.removeItem('role'),
        localStorage.removeItem('profile'),
        localStorage.removeItem('cart'),
      ]);
    } catch (err) {
      console.warn('Sign out cleanup failed:', err);
    } finally {
      clearUser();
      clearRole();
      clearProfile();
      clearCart();
      setIsLoggedIn(false);
    }
  }, [clearUser, clearRole, clearProfile, clearCart]);

  const value = useMemo<AuthContextValue>(
    () => ({ isLoggedIn, isLoading, signIn, signOut }),
    [isLoggedIn, isLoading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}