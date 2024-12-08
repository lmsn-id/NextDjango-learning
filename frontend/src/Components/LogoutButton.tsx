"use client";

import React from "react";
import { useLogoutAdmin } from "@/hook/useLogout";

export default function LogoutButton() {
  const { handleLogout } = useLogoutAdmin();

  return <button onClick={handleLogout}>Logout</button>;
}
