import './globals.css';
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { WordsPreloaderGate } from "@/components/words-preloader";
import { Analytics } from "@vercel/analytics/next";
import { GeistPixelGrid, GeistPixelSquare } from "geist/font/pixel";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgentFab } from "@/components/agent/agent-fab";
import { ThemeInitScript } from "@/components/theme-init-script";
import { WalkingAvatar } from "@/components/walking-avatar";

export const metadata: Metadata = {
  title: "Abhishek Swami",
  description: "Full Stack AI Engineer",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${GeistPixelSquare.variable} ${GeistPixelGrid.variable}`}
      >
        <head>
          <ThemeInitScript />
          <title>Abhishek Swami</title>
          <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
          <link rel="apple-touch-icon" href="/favicon.png" />
          <link rel="preload" as="image" href="/avatar.jpg" fetchPriority="high" />
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {/* <WordsPreloaderGate> */}
                {children}
                {/* <WalkingAvatar /> */}
                {/* <AgentFab /> */}
                <Analytics />
              {/* </WordsPreloaderGate> */}
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
