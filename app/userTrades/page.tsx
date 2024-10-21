"use client";
import React, { useState } from "react";
import style from "./Marketplace.module.scss";
import Header from "../components/header/Header";
import TradeCard from "../components/TradeCard/TokenCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";

import ProductCard from "../components/TradeCard/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import TradeCardSkeleton from "../components/Skeleton/TradeCardSkeleton";

const Marketplace = () => {
  const [currentTrade, setCurrentTrade] = useState<any>();
  const [tradeType, setTradeType] = useState("Tokens");

  const { address } = useAccount();
  //fetch trades
  //const tradesCollectionRef = collection(db, "trades");

  const fetchTrades = async () => {
    const sellerQuery = query(
      collection(db, "trades"),
      where("sellerAddress", "==", address)
    );
    const buyerQuery = query(
      collection(db, "trades"),
      where("buyerAddress", "==", address)
    );

    const [sellerSnapshot, buyerSnapshot] = await Promise.all([
      getDocs(sellerQuery),
      getDocs(buyerQuery),
    ]);

    const sellerTrades = sellerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const buyerTrades = buyerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return [...sellerTrades, ...buyerTrades];
  };

  const {
    data: trades,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trades", address],
    queryFn: () => fetchTrades(),
    staleTime: 60000, // Cache for 60 seconds
  });

  console.log("trades us", trades);

  const handleTrade = (trade: any) => {
    setCurrentTrade(trade);
  };

  return (
    <>
      <Header />
      <div className={style.container}>
        <div className={style.content}>
          <div className={style.top}>
            <h2>My Trades</h2>
            <div className={style.tabsContainer}>
              <div
                className={
                  tradeType === "Tokens"
                    ? style.tab + " " + style.activeTab
                    : style.tab
                }
                onClick={() => setTradeType("Tokens")}
              >
                <p>Tokens</p>
              </div>
              <div
                className={
                  tradeType === "Digital products"
                    ? style.tab + " " + style.activeTab
                    : style.tab
                }
                onClick={() => setTradeType("Digital products")}
              >
                <p>Digital products</p>
              </div>
              <div
                className={
                  tradeType === "Physical item"
                    ? style.tab + " " + style.activeTab
                    : style.tab
                }
                onClick={() => setTradeType("Physical item")}
              >
                <p>Physical products</p>
              </div>
            </div>
          </div>
          {tradeType === "Tokens" ? (
            <>
              {!isLoading ? (
                <div className={style.tradeGrid}>
                  {trades?.map((tr: any) =>
                    tr?.tradeOption === "Token swap" &&
                    tr?.status !== "complete" ? (
                      <TradeCard
                        key={tr?.id}
                        trade={tr}
                        handleTrade={handleTrade}
                        cardAction="View"
                      />
                    ) : (
                      ""
                    )
                  )}
                </div>
              ) : (
                <div className={style.tradeGrid}>
                  <TradeCardSkeleton />
                </div>
              )}
            </>
          ) : tradeType === "Digital products" ? (
            <>
              {!isLoading ? (
                <div className={style.tradeGrid}>
                  {trades?.map((tr: any) =>
                    tr?.tradeOption === "Digital product" &&
                    tr?.status !== "complete" ? (
                      <ProductCard
                        key={tr?.id}
                        trade={tr}
                        handleTrade={handleTrade}
                        cardAction="View"
                      />
                    ) : (
                      ""
                    )
                  )}
                </div>
              ) : (
                <div className={style.tradeGrid}>
                  <TradeCardSkeleton />
                </div>
              )}
            </>
          ) : tradeType === "Physical item" ? (
            <>
              {!isLoading ? (
                <div className={style.tradeGrid}>
                  {trades?.map((tr: any) =>
                    tr?.tradeOption === "Physical item" &&
                    tr?.status !== "complete" ? (
                      <ProductCard
                        key={tr?.id}
                        trade={tr}
                        handleTrade={handleTrade}
                        cardAction="View"
                      />
                    ) : (
                      ""
                    )
                  )}
                </div>
              ) : (
                <div className={style.tradeGrid}>
                  <TradeCardSkeleton />
                </div>
              )}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Marketplace;
