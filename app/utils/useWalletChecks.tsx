"use client";
import { useState, useEffect, useCallback } from "react";
import { useConnect, useChainId, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Chain configuration
const ACCEPTED_CHAINS = ["84532"]; // Base Sepolia chain ID
const BASE_SEPOLIA_CHAIN_ID = 84532; // Using number directly for chainId

export function useWalletChecks(addressContext?: string) {
  const [isConnected, setIsConnected] = useState(!!addressContext);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const chainId = useChainId();
  const { connectAsync } = useConnect();
  const { switchChainAsync } = useSwitchChain();

  // Check if current chain is supported
  useEffect(() => {
    setIsSupported(ACCEPTED_CHAINS.includes(chainId.toString()));
  }, [chainId]);

  // Function to connect wallet
  const connectWallet = useCallback(async (): Promise<boolean> => {
    if (addressContext) {
      setIsConnected(true);
      return true;
    }

    setIsLoadingWallet(true);
    setError(null);

    try {
      const result = await connectAsync({
        chainId: baseSepolia.id,
        connector: injected(),
      });

      const connected = !!result?.account;
      setIsConnected(connected);
      return connected;
    } catch (err) {
      console.error("Connection failed:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setIsLoadingWallet(false);
    }
  }, [addressContext, connectAsync]);

  // Function to switch chain
  const switchToCorrectChain = useCallback(async (): Promise<boolean> => {
    if (isSupported) return true;

    setIsLoadingWallet(true);
    setError(null);

    try {
      const result = await switchChainAsync({
        chainId: BASE_SEPOLIA_CHAIN_ID,
      });

      const switched = result?.id === BASE_SEPOLIA_CHAIN_ID;
      return switched;
    } catch (err) {
      console.error("Chain switch failed:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setIsLoadingWallet(false);
    }
  }, [isSupported, switchChainAsync]);

  // Helper function that ensures both connection and chain are correct
  const ensureWalletReady = useCallback(async (): Promise<boolean> => {
    if (!isConnected) {
      const connected = await connectWallet();
      if (!connected) return false;
    }

    if (!isSupported) {
      const switched = await switchToCorrectChain();
      if (!switched) return false;
    }

    return true;
  }, [isConnected, isSupported, connectWallet, switchToCorrectChain]);

  return {
    isConnected,
    isSupported,
    isLoadingWallet,
    error,
    connectWallet,
    switchToCorrectChain,
    ensureWalletReady,
  };
}
