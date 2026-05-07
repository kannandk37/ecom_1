import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { User } from '../../entity/user';


interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({ user, setUser, clearUser }),
    [user, setUser, clearUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
  return ctx;
}