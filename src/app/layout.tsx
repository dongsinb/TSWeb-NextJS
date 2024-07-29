import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderTS from "@/components/header/header";
import Sidebar from "@/components/sidebar/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="layout">
          <Sidebar />
          <div className="layout__main-content">
            <HeaderTS></HeaderTS>
            <main className="main-content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
