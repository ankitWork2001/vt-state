import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from '@/components/common/ClientLayout'


const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "Mindful Path",
  description: "A journey towards mindfulness and well-being",
   icons: {
    icon: "/iconMindfulness.png", // or your icon path
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
