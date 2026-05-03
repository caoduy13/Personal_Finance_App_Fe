import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthActions, AuthState } from "./types";

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        user: null,
        role: null,
        setAuth: ({ accessToken, role, user }) => set({ accessToken, role, user }),
        clearAuth: () => set({ accessToken: null, role: null, user: null }),
        setUser: (user) =>
          set((state) => ({
            user: state.user
              ? ({ ...state.user, ...user } as typeof state.user)
              : ({ ...(user as object) } as typeof state.user),
          })),
        updateUser: (fields) =>
          set((state) =>
            state.user
              ? { user: { ...state.user, ...fields } as typeof state.user }
              : {},
          ),
      }),
      {
        name: "auth-storage",
      },
    ),
  ),
);
