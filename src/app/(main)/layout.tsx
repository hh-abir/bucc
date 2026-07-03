import { Navbar } from "@/components/Navbar";
import { AnnouncementBar } from "@/components/ui/AnnouncementBar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
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
