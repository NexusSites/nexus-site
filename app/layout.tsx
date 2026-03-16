import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus Sites — בניית אתרים מודרניים לעסקים",
  description:
    "Nexus Sites מתמחה בבניית אתרים מודרניים, מהירים וממירים שמביאים לעסקים יותר לקוחות.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
