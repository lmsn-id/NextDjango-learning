import HomePage from "./Home/page";
import Navbar from "@/Components/Navbar";
import Layanan from "./Home/View/Layanan";
import Informasi from "./Home/View/Informasi";
import Gallary from "./Home/View/Gallary";

export const metadata = {
  title: "SMKN 5 || Home",
  description: "SMKN 5 Kabupaten Tangerang",
};
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full h-full">
        <HomePage />
        <Layanan />
        <Informasi />
        <Gallary />
      </main>
    </>
  );
}
