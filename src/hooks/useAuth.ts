"use client";

import { useUser, useSignIn, useSignUp, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signIn, setActive } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      if (!signIn) {
        return { success: false, error: "Sign in not available" };
      }

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
        return { success: true, data: result };
      } else {
        return { success: false, error: "Login incomplete" };
      }
    } catch (error: any) {
      return { success: false, error: error.errors?.[0]?.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      if (!signUp) {
        return { success: false, error: "Sign up not available" };
      }

      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
      });

      if (result.status === "complete") {
        await setActiveSignUp({ session: result.createdSessionId });
        router.push('/dashboard');
        return { success: true, data: result };
      } else if (result.status === "missing_requirements") {
        // Handle email verification if required
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        return { success: true, data: result, requiresVerification: true };
      } else {
        return { success: false, error: "Registration incomplete" };
      }
    } catch (error: any) {
      return { success: false, error: error.errors?.[0]?.message || "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!signIn) {
        return { success: false, error: "Sign in not available" };
      }

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.errors?.[0]?.message || "Password reset failed" };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      await user.updatePassword({ newPassword });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.errors?.[0]?.message || "Password update failed" };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated: isSignedIn || false,
    isLoading: !isLoaded || isLoading,
    login,
    logout,
    register,
    resetPassword,
    updatePassword,
  };
}

export function useCurrentUser() {
  const { user } = useAuth();
  return user;
}