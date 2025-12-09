import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-Montserrat-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Go Delivery - Хүргэлтийн ажилтан",
  description: "UB Delivery хүргэлтийн ажилтны аппликейшн",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
