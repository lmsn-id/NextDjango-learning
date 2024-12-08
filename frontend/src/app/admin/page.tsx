// app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import LogoutButton from "@/Components/LogoutButton";

export const metadata = {
  title: "SMKN 5 || Admin ",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.is_superuser || !session.accessToken) {
    redirect("/404");
  }

  return (
    <div>
      <h1>Selamat Datang, Superuser!</h1>
      <LogoutButton />
    </div>
  );
}
