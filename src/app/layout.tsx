import type { Metadata } from "next";
import { JetBrains_Mono, Poppins } from "next/font/google";
import { DEFAULT_THEME, themeInitScript } from "@/lib/themes";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Khadija Zahra — Full Stack & AI Engineer",
  description:
    "Portfolio of Khadija Zahra, a full-stack and AI engineer building with TypeScript, Next.js, Node.js, PostgreSQL and RAG pipelines.",
};

export const viewport = {
  colorScheme: "dark" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${DEFAULT_THEME} ${poppins.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}