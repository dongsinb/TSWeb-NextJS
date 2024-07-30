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
        <div className="container">
          <Sidebar />
          <div className="content">
            <HeaderTS></HeaderTS>
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
