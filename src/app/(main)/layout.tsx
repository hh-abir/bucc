import { Navbar } from "@/components/Navbar";
import { AnnouncementBar } from "@/components/ui/AnnouncementBar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import Preloader from "@/components/public/Preloader";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Preloader />
      <AnalyticsTracker />
      <AnnouncementBar />
      <Navbar />
      <main className="relative min-h-[calc(100vh-140px)]">
        {children}
      </main>
      <Footer/>
      <ScrollToTop />
    </>
  );
}
