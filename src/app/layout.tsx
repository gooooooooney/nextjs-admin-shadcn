import { Provider } from "@/components/provider";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";

import "@/styles/globals.css";

import { Inter } from "next/font/google";

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
