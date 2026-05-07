import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Profile } from '../../entity/profile';

interface ProfileContextValue {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  updateProfile: (partial: Partial<Profile>) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<Profile | null>(null);

  const setProfile = useCallback((p: Profile | null) => {
    setProfileState(p);
  }, []);

  // Merge partial updates into the existing profile
  const updateProfile = useCallback((partial: Partial<Profile>) => {
    setProfileState((prev) =>
      prev ? { ...prev, ...partial } : { ...partial }
    );
  }, []);

  const clearProfile = useCallback(() => {
    setProfileState(null);
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({ profile, setProfile, updateProfile, clearProfile }),
    [profile, setProfile, updateProfile, clearProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
}