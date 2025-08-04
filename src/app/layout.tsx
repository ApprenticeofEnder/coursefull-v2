import { type Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";

import { ThemeProvider } from "~/components/theme-provider";
import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "CourseFull",
  description: "Set goals for your academic life the right way.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${atkinsonHyperlegible.variable} bg-background text-foreground`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
