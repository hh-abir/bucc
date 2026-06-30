import "@/app/globals.css";
import "@/app/prosemirror.css";
import type { Metadata } from "next";
import Providers from "@/util/Providers";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bracucc.org'),
  title: {
    default: "BRAC University Computer Club | Upgrade Yourself",
    template: "%s | BUCC",
  },
  description: "BRAC University Computer Club (BUCC) is the oldest and largest tech community at BRAC University, founded in 2001. We empower the next generation of tech leaders.",
  keywords: ["BUCC", "BRAC University", "Computer Club", "Tech Community", "Programming", "Robotics", "Bangladesh", "BRACU"],
  openGraph: {
    title: "BRAC University Computer Club",
    description: "Empowering the next generation of tech leaders since 2001.",
    url: "https://www.bracucc.org",
    siteName: "BUCC Web Portal",
    images: [
      {
        url: "/images/cover.jpeg", // Default fallback image
        width: 1200,
        height: 630,
        alt: "BUCC Cover Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BRAC University Computer Club",
    description: "Empowering the next generation of tech leaders since 2001.",
    images: ["/images/cover.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
