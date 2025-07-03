"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import style from "./MyTrade.module.scss";
import Header from "../components/header/Header";
import TradeCard from "../components/TradeCard/Card";
import { collection, or, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAccount } from "wagmi";
import { useDocsQuery } from "../utils/functions/firebaseFunctions";
import { AnimatePresence } from "framer-motion";
import Connect from "../components/connectWallet/Connect";
import Create from "../components/createTrade/Create";
import { useChainId } from "wagmi";
import { UserContext } from "../context/UserContext";
import { useSwitchChain } from "wagmi";

import noTrades from "./noTrades.svg";
import Image from "next/image";
import ConnectBtnK from "../components/header/KitButton";
import { KitProvider } from "../KitProvider";
import { ConnectKitButton } from "connectkit";

const MyTrades = () => {
  const [showConnect, setShowConnect] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const { address, isConnected, connector: activeConnector } = useAccount();

  const [userState] = useContext<any>(UserContext);

  const { switchChain } = useSwitchChain();

  const docCollectionRef = query(
    collection(db, "trades"),
    or(
      where("pBuyer", "==", address || ""),
      where("sellerAddress", "==", address || "")
    )
  );

  const docsQuery = useDocsQuery(
    ["trades", isConnected, address],
    docCollectionRef
  );

  const trades = useMemo(
    () =>
      docsQuery.data?.docs.map((doc: any) => ({
        ...doc.data(),
        userId: doc.id,
      })) ?? [],
    [docsQuery.data?.docs]
  );

  const activeTrades = trades.filter(
    (trade: any) => trade.status !== "available"
  );
  //

  const addressContext = address || userState?.address;
  const userAddress =
    typeof window !== "undefined"
      ? localStorage.getItem("userAddress")
      : address;
  const isSupported = userState?.supportedChain;
  //console.log("addressContext --", addressContext);

  const handleClose = () => {
    setShowConnect(false);
    setShowCreate(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showConnect && <Connect handleClose={handleClose} />}
        {showCreate && <Create handleClose={handleClose} />}
      </AnimatePresence>
      <Header currentPage="My trades" />
      <div className={style.container}>
        <div className={style.content}>
          <div className={style.top}>
            <div className={style.title}>
              <h3>My Trades</h3>
              <p>All your trading history</p>
            </div>
            <div className={style.filters}></div>
          </div>
          <div className={style.trades}>
            <div className={style.singleTrade}>
              {activeTrades?.length >= 1 &&
                activeTrades?.map((trade: any) => (
                  <TradeCard
                    key={trade?.userId}
                    trade={trade}
                    // handleTrade={handleTrade}
                    cardAction="Buy"
                  />
                ))}
              {activeTrades?.length === 0 && (
                <div className={style.noTrade}>
                  <Image src={noTrades} alt="no trades" />
                  <h3>No active trades</h3>
                  <p>
                    Click the button below to create a new ad and initiate a
                    trade.
                  </p>
                  {userAddress !== "" &&
                  userAddress !== "null" &&
                  userAddress !== null ? (
                    // <button
                    //   onClick={() => setShowConnect(true)}
                    //   className={style.mainBtn}
                    // >
                    //   Connect wallet
                    // </button>
                    <button
                      // onClick={handleModals}
                      onClick={() => setShowCreate(true)}
                      className={style.mainBtn}
                    >
                      Create Ad
                    </button>
                  ) : (
                    <KitProvider>
                      <ConnectKitButton.Custom>
                        {({ isConnected, show, truncatedAddress, ensName }) => {
                          return (
                            <button onClick={show} className={style.mainBtn}>
                              {isConnected
                                ? (ensName ?? truncatedAddress)
                                : "Connect Wallet"}
                            </button>
                          );
                        }}
                      </ConnectKitButton.Custom>
                    </KitProvider>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyTrades;
