import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata: Metadata = {
  title: { default: "Sunrise Public School", template: "%s | Sunrise Public School" },
  description: "Sunrise Public School — Building Bright Futures Through Quality Education.",
  openGraph: { title: "Sunrise Public School", description: "Building Bright Futures Through Quality Education.", type: "website" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
