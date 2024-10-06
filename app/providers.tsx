"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";

//import { rainbowConfig } from "@/app/utils/wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";

export function Providers(props: { children: ReactNode; initialState?: any }) {
  const wcprojectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  // const [config] = useState(() => rainbowConfig());
  const [queryClient] = useState(() => new QueryClient());

  const config = getDefaultConfig({
    appName: "Tradebase",
    projectId: wcprojectId || "",
    chains: [base, baseSepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider showRecentTransactions={true}>
          {props.children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
