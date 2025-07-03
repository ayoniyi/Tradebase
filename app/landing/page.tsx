"use client";
import React, { useContext, useEffect, useState } from "react";
import Header from "@/app/components/header/Header";
import style from "./Landing.module.scss";
import Image from "next/image";
import heroImg from "./hero.png";
import Connect from "../components/connectWallet/Connect";
import { AnimatePresence } from "framer-motion";
import Create from "../components/createTrade/Create";
import { useAccount } from "wagmi";
import ConnectBtnK from "../components/header/KitButton";
import { KitProvider } from "../KitProvider";
import { ConnectKitButton } from "connectkit";
import { UserContext } from "../context/UserContext";

const Landing = () => {
  const { isConnected, isDisconnected, address } = useAccount();
  const [showConnect, setShowConnect] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [userState] = useContext<any>(UserContext);
  const addressContext = address || userState?.address;
  const userAddress =
    typeof window !== "undefined"
      ? localStorage.getItem("userAddress")
      : address;

  console.log("userAddress", userAddress);

  const handleClose = () => {
    setShowConnect(false);
    setShowCreate(false);
  };

  const handleCreate = () => {
    setShowConnect(false);
    setShowCreate(true);
  };

  useEffect(() => {
    setShowCreate(false);
  }, [isConnected]);

  const handleModals = () => {
    if (isConnected) {
      setShowConnect(false);
      setShowCreate(true);
    } else {
      setShowCreate(false);
      setShowConnect(true);
    }
    //setShowConnect(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showConnect && (
          <Connect
            action="createTrade"
            handleClose={handleClose}
            handleCreate={handleCreate}
          />
        )}
        {showCreate && <Create handleClose={handleClose} />}
      </AnimatePresence>

      <Header currentPage="Home" />
      <div className={style.hero}>
        <div className={style.heroContent}>
          <div className={style.heroDesc}>
            <div className={style.heroTxt}>
              <h1>
                Secure your <span> trades</span> with <span> confidence </span>
              </h1>
              <p>
                Simple and efficient trades with built-in escrow on the base
                network.
              </p>
              {userAddress !== "null" &&
              userAddress !== "" &&
              userAddress !== null ? (
                <button className={style.createBtn} onClick={handleModals}>
                  Create Ad
                </button>
              ) : (
                <KitProvider>
                  <ConnectKitButton.Custom>
                    {({ isConnected, show, truncatedAddress, ensName }) => {
                      return (
                        <button onClick={show} className={style.createBtn}>
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
          </div>
          <div className={style.heroImg}>
            <Image src={heroImg} alt="hero" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
