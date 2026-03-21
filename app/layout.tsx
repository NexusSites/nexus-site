import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-heebo",
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
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body>
        {children}
        <Script src="https://cdn.enable.co.il/licenses/enable-L54535rnygtndxeb-0326-80797/init.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
