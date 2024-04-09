import { Provider } from "@/components/provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { extractRouterConfig } from "uploadthing/server";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { ourFileRouter } from "@/server/uploadthing";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Nextjs admin ",
  description: "Nextjs admin with shadcn-ui",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
type RootLayoutProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={`font-sans ${inter.variable}`}>
        <Provider>
          {/* <NextSSRPlugin
            routerConfig={extractRouterConfig(ourFileRouter)}
          /> */}
          {children}
          <TailwindIndicator />
          <Toaster richColors />
        </Provider>
      </body>
    </html>
  );
}
