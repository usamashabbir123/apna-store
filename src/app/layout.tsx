import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import DynamicFooter from "@/components/DynamicFooter";
import { getSettings } from "@/lib/actions/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apna — Modern Fashion from Lahore",
  description: "Discover curated fashion that blends modern elegance with timeless tradition. Shop men, women, traditional wear and accessories at Apna.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const theme = settings.theme || {};

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{
          fontFamily: theme.fontFamily || 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <ThemeProvider>
          <AdminAuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main>{children}</main>
                <CartDrawer />
                <DynamicFooter />
              </WishlistProvider>
            </CartProvider>
          </AdminAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
