import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/ui/Notification";
import { AuthProvider } from "@/components/providers/AuthProvider";

const montserrat = Montserrat({
  variable: "--font-Montserrat-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Admin - UB Delivery",
  description: "Restaurant administration panel for UB Delivery",
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
          <AuthProvider>
            {children}
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
