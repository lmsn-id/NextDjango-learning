import { DefaultUser, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    access: string;
    refresh: string;
    is_superuser: boolean; // Tambahkan ini
  }

  interface Session extends DefaultSession {
    accessToken: string;
    refreshToken: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      is_superuser: boolean; // Tambahkan ini
    };
  }
}
