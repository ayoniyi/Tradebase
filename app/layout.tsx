"use client";
import type { Metadata } from "next";
import "./styles/globals.css";
import "./styles/fonts.css";
//import "./styles/selectTk.css";
import "@rainbow-me/rainbowkit/styles.css";
import Favicon from "@/app/favicon.svg";
// import { cookieToInitialState } from "wagmi";
// import { rainbowConfig } from "./utils/wagmi";
// import { headers } from "next/headers";
import { Providers } from "./providers";
import Toasts from "./components/Toasts";
import SmallScreen from "./components/SmallScreen/Small";
import { UserContextProvider } from "./context/UserContext";

export const metadata: Metadata = {
  title: "Tradebase",
  description: "P2P Marketplace for base network",
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const initialState = cookieToInitialState(
  //   rainbowConfig(),
  //   headers().get("cookie")
  // );

  return (
    <html lang="en">
      <Toasts />
      <SmallScreen />

      <body className="app">
        <UserContextProvider>
          <Providers>{children}</Providers>
        </UserContextProvider>
      </body>
    </html>
  );
}
