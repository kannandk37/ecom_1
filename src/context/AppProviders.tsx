import React, { ReactNode } from 'react';
import { UserProvider } from './user';
import { RoleProvider } from './role';
import { ProfileProvider } from './profile';
import { CartProvider } from './cart';
import { AuthProvider } from './auth';

/*
  Provider order matters:
  - User, Role, Profile, Cart must be above Auth
  - because AuthProvider calls hooks from all four of them (useUser, useRole, etc.)
*/

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <UserProvider>
      <RoleProvider>
        <ProfileProvider>
          <CartProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </CartProvider>
        </ProfileProvider>
      </RoleProvider>
    </UserProvider>
  );
};