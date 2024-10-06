import { http, createConfig } from "wagmi";
import { base, mainnet, optimism, baseSepolia } from "wagmi/chains";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const wcprojectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// export const config = createConfig({
//   chains: [mainnet, base],
//   connectors: [
//     injected(),
//     walletConnect({ projectId }),
//     metaMask(),
//     safe(),
//     coinbaseWallet({ appName: "Tradebase", preference: "smartWalletOnly" }),
//   ],
//   transports: {
//     [mainnet.id]: http(),
//     [base.id]: http(),
//   },
// });

export function getConfig() {
  return createConfig({
    chains: [baseSepolia],
    connectors: [
      walletConnect({ wcprojectId }),
      metaMask(),
      coinbaseWallet({ appName: "Tradebase", preference: "smartWalletOnly" }),
    ],
    transports: {
      [baseSepolia.id]: http(),
    },
  });
}

export function rainbowConfig() {
  return getDefaultConfig({
    appName: "Tradebase",
    projectId: wcprojectId || "",
    chains: [base, baseSepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
