import "./globals.css";
import { Outfit } from "next/font/google";
import { AuthProvider } from  "./Providers";

const outfit = Outfit({ subsets: ["latin"] });


export const metadata = {
  title: "Sharded Blockchain Data Management and Monetization System",
  description: "Blockchain monetization system for revenue generations based on submitted reports.",
};

export default function RootLayout({children}) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <AuthProvider>
        <body className={outfit.className}>{children}</body>
      </AuthProvider>
    </html>
  );
}
