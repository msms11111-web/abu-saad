import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Brew Recipes | وصفات القهوة المختصة الفاخرة",
  description: "متجر رقمي فاخر لبيع وصفات القهوة المختصة. اشترِ وصفات V60 و Espresso و Chemex و Cold Brew. اشتراك شهري للوصول إلى كل الوصفات مع حاسبة ذكية وفيديوهات احترافية.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Brew Recipes - وصفات القهوة المختصة",
    description: "اكتشف أسرار القهوة المختصة مع أفضل الوصفات من أشهر المحامص العالمية.",
    images: [{ url: "/og-image.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoArabic.variable} font-sans antialiased bg-[#F8F4EE] dark:bg-[#1C1C1C]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster 
              position="top-center" 
              richColors 
              closeButton 
              className="font-sans"
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
