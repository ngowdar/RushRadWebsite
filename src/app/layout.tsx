import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rush Radiology Mock",
  description: "Department of Radiology — Rush University Medical Center",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
