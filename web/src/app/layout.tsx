import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PT System",
  description: "Personal Trainer Management System",
};

const themeScript = `
  (function () {
    try {
      var theme = localStorage.getItem("pt-system-theme");
      var isDark = theme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    } catch (_) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} bg-background text-foreground dark:bg-[#0F1115] dark:text-[#F3F4F6]`}
      >
        {children}
      </body>
    </html>
  );
}
