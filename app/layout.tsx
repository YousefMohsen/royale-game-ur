import type { Metadata } from "next";
import type { ReactNode } from "react";
import { appConfig, pageTitle } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: pageTitle(),
  description: appConfig.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
