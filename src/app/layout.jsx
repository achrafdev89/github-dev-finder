import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    display: "swap",
});
const jetbrains = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains",
    display: "swap",
});
export const metadata = {
    title: {
        default: "devfinder — GitHub Developer Intelligence",
        template: "%s · devfinder",
    },
    description: "Discover, analyze, and compare GitHub developers. Explore repositories, language stats, and contribution activity in a premium developer dashboard.",
    metadataBase: new URL("https://devfinder.app"),
    openGraph: {
        title: "devfinder — GitHub Developer Intelligence",
        description: "Discover, analyze, and compare GitHub developers.",
        type: "website",
    },
};
export default function RootLayout({ children }) {
    return (<html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen">
        <Providers>
          <Navbar />
          <main className="mx-auto min-h-screen max-w-6xl px-4 pt-24">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>);
}
