import type { Metadata } from "next";
import { Abril_Fatface, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const abril = Abril_Fatface({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abril",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "GLOBAL Hair Saloon",
  description: "The craft of grooming as a storied tradition. Serving the discerning gentleman since 2024.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${abril.variable} ${hanken.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
