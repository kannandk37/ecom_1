import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Role } from '../../entity/role';
import { Permission } from '../../entity/permission';

interface RoleContextValue {
  role: Role | null;
  setRole: (role: Role | null) => void;
  clearRole: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role | null>(null);

  const setRole = useCallback((r: Role | null) => {
    setRoleState(r);
  }, []);

  const clearRole = useCallback(() => {
    setRoleState(null);
  }, []);

  // Returns true if current role includes the given permission
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!role?.permissions) return false;
      return role.permissions.includes(permission);
    },
    [role]
  );

  const value = useMemo<RoleContextValue>(
    () => ({ role, setRole, clearRole, hasPermission }),
    [role, setRole, clearRole, hasPermission]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside <RoleProvider>');
  return ctx;
}