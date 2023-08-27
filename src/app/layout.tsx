import { Lato } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const lato = Lato({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Next.js 13 + Shopify",
  description: "Generated by create-next-app"
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body className={lato.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
