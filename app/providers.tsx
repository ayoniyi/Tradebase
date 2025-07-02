"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";

// import useNotifications from "./utils/functions/useNotifications";
// import { useContext } from "react";
// import { UserContext } from "./context/UserContext";

//import { rainbowConfig } from "@/app/utils/wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { UserContextProvider } from "./context/UserContext";

export function Providers(props: { children: ReactNode; initialState?: any }) {
  const wcprojectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  // const [config] = useState(() => rainbowConfig());
  const [queryClient] = useState(() => new QueryClient());

  const config = getDefaultConfig({
    appName: "Tradebase",
    projectId: wcprojectId || "",
    chains: [base, baseSepolia],
    ssr: true,
  });

  // const [userState] = useContext<any>(UserContext);
  // useNotifications(userState?.user?.userId);

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          {/* <RainbowKitProvider showRecentTransactions={true}> */}
          {props.children}
          {/* </RainbowKitProvider> */}
        </UserContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
