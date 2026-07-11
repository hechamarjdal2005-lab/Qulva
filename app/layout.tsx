import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Qulva",
  description: "Human Optimization Through Clinical Precision. Science is the only architect.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white flex flex-col selection:bg-black selection:text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
