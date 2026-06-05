import './globals.css';
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { GeistPixelGrid, GeistPixelSquare } from "geist/font/pixel";

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
          <title>Abhishek Swami</title>
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
