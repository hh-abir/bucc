import { Navbar } from "@/components/Navbar";
import { AnnouncementBar } from "@/components/ui/AnnouncementBar";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="relative min-h-[calc(100vh-140px)]">
        {children}
      </main>
      <Footer/>
    </>
  );
}
