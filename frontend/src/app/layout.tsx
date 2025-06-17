import type { Metadata } from "next";
import { Sora, Inter, Orbitron, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
// import { AppProvider } from "@/context/AppContext";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600", "700"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "NeuraTwin",
  description: "Your Own Self Reflection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${sora.variable}
          ${inter.variable} 
          ${orbitron.variable} 
          ${outfit.variable} 
          antialiased`}
      >
        {/* <AppProvider>{children}</AppProvider> */}
        {children}

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}
