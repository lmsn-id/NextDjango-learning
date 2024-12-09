import { usePathname } from "next/navigation";

export const hiddenNavbar = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pathname = usePathname() || "";

  return (
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/404") ||
    pathname.startsWith("/e-learning")
  );
};
