import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/ui/Notification";

const montserrat = Montserrat({
  variable: "--font-Montserrat-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "UB Delivery",
  description: "The most convenient way to order food from UB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${montserrat.variable} flex flex-col min-h-full`}
      >
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
