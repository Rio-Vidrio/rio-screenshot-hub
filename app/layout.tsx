import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rio Screenshot Hub",
  description: "Personal AI-powered screenshot interpreter for Rio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full antialiased"
        style={{
          background: "#FAFAF9",
          color: "#1A1714",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
