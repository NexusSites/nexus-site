import type { Metadata } from "next";
import { Inter, Heebo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const heebo = Heebo({
  subsets: ["hebrew"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus Sites — הנדסת אתרים מודרניים לעסקים",
  description:
    "Nexus Sites מתמחה בהנדסת אתרים מודרניים, מהירים וממירים — פלטפורמות דיגיטליות שמביאות תוצאות עסקיות מדידות.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${inter.variable} ${heebo.variable}`}>
      <body>
        {children}
        <Script src="https://cdn.enable.co.il/licenses/enable-L54535rnygtndxeb-0326-80797/init.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
