import { authCheckStatus, authLogin } from "@/core/auth/actions/auth-actions";
import { UserCliente } from "@/core/auth/interface/userCliente";
import { UserTaller } from "@/core/auth/interface/userTaller";
import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapter";
import { create } from "zustand";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";
export type User = UserCliente | UserTaller; // 👈 aceptar ambos

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;
  login: (email: string, password: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
  changeStatus: (token?: string, user?: User) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: "checking",
  token: undefined,
  user: undefined,

  changeStatus: async (token?: string, user?: User) => {
    if (!token || !user) {
      set({ status: "unauthenticated", token: undefined, user: undefined });
      await SecureStorageAdapter.deleteItem("token");
      return false;
    }

    set({ status: "authenticated", token, user });
    await SecureStorageAdapter.setItem("token", token);
    return true;
  },

  login: async (email: string, password: string) => {
    const resp = await authLogin(email, password);
    return get().changeStatus(resp?.token, resp?.user);
  },

  checkStatus: async () => {
    const resp = await authCheckStatus();
    get().changeStatus(resp?.token, resp?.user);
  },

  logout: async () => {
    await SecureStorageAdapter.deleteItem("token");
    set({ status: "unauthenticated", token: undefined, user: undefined });
  },
}));
