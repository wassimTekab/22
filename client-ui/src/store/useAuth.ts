import { defineStore } from "pinia";
import { authService } from "@/core/services/AuthService";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    let isLoggedIn: any;
    let currentUser: any;
    return {
      currentUser,
      accessToken: "",
      refreshToken: "",
      isLoggedIn,
    };
  },
  actions: {
    async login(email: string, password: string) {
      await authService.signInWithEmail(email, password);
    },
    async signUp(email: string, password: string, role: string) {
      await authService.signUp(email, password, role);
    },
    async resetByEmail(email: string) {
      await authService.resetByEmail(email);
    },
    async reset(password: string) {
      await authService.reset(password);
    },
    async logout() {
      await authService.signOut();
    },

    async getCurrent() {
      const result = await authService.getCurrent();
      this.isLoggedIn = result.isLoggedIn;
      if (result.session) {
        this.currentUser = result.session.user;
        this.accessToken = result.session.access_token;
        this.refreshToken = result.session.refresh_token!;
      } else {
        this.currentUser = null;
        this.accessToken = "";
        this.refreshToken = "";
      }
      console.log("isLoggedIn ", this.isLoggedIn);
    },
  },
});
