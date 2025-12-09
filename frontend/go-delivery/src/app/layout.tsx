import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
