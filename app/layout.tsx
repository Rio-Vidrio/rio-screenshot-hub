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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full antialiased" style={{ background: "#0e0e0e", color: "#e8e8e8", fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
