import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/hook/api";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const { ApiBackend } = api();

          const pathname = req.headers?.referer || "";
          let loginPath;

          if (pathname.includes("/accounts/login/admin")) {
            loginPath = "api/auth/login/admin";
          } else if (pathname.includes("/accounts/login/siswa")) {
            loginPath = "api/auth/login/siswa";
          } else {
            throw new Error("Invalid login path");
          }

          const LoginURL = ApiBackend(loginPath);

          const response = await fetch(LoginURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Login failed:", errorData);
            throw new Error(errorData.error || "Login failed");
          }

          const user = await response.json();

          if (pathname.includes("/accounts/login/admin")) {
            if (!user || user.is_superuser !== true) {
              throw new Error("Invalid admin data or authorization failed");
            }
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              access: user.access || "",
              refresh: user.refresh || "",
              message: user.message || "",
              redirect: user.redirect,
              is_superuser: user.is_superuser || false,
            };
          } else if (pathname.includes("/accounts/login/siswa")) {
            if (!user || user.role !== "siswa") {
              throw new Error("Invalid student data or authorization failed");
            }
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              access: user.access || "",
              refresh: user.refresh || "",
              redirect: user.redirect,
              message: user.message || "",
              role: "siswa",
            };
          }
          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error((error as Error).message || "Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access = user.access || "";
        token.refresh = user.refresh || "";
        token.is_superuser = user.is_superuser || false;
        token.role = user.role;
        token.redirect = user.redirect;
        token.message = user.message;
        token.exp = Date.now() / 1000 + 60 * 15;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (typeof token.exp === "number" && token.exp < currentTime) {
        if (typeof token.refresh === "string" && token.refresh.length > 0) {
          try {
            const refreshedToken = await refreshAccessToken(token.refresh);
            token.access = refreshedToken.access;
            token.refresh = refreshedToken.refresh;
            token.exp = Date.now() / 1000 + 60 * 15;
          } catch (error) {
            console.error("Error refreshing token:", error);
            token.access = "";
            token.refresh = "";
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken =
        typeof token.access === "string" ? token.access : "";
      session.refreshToken =
        typeof token.refresh === "string" ? token.refresh : "";
      session.user = {
        ...session.user,
        is_superuser:
          typeof token.is_superuser === "boolean" ? token.is_superuser : false,
        username: token.name || "",
        role: typeof token.role === "string" ? token.role : "",
        redirect: typeof token.redirect === "string" ? token.redirect : "",
        message: typeof token.message === "string" ? token.message : "",
      };
      return session;
    },
  },
  pages: {
    signIn: "/accounts/login/admin",
    error: "/api/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 15,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

async function refreshAccessToken(refreshToken: string) {
  const { ApiBackend } = api();
  const RefreshURL = ApiBackend("api/auth/refresh");

  try {
    const response = await fetch(RefreshURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to refresh token");
    }

    const data = await response.json();
    return { access: data.access, refresh: data.refresh };
  } catch {
    throw new Error("Error during token refresh");
  }
}

export async function signOutFromBackend(refreshToken: string) {
  const { ApiBackend } = api();
  const LogoutURL = ApiBackend("api/auth/logout/");

  try {
    const response = await fetch(LogoutURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }
  } catch {
    throw new Error("Error during logout");
  }
}

export default NextAuth(authOptions);
