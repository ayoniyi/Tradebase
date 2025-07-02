"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/components/header/Header";
import style from "./Landing.module.scss";
import Image from "next/image";
import heroImg from "./hero.png";
import Connect from "../components/connectWallet/Connect";
import { AnimatePresence } from "framer-motion";
import Create from "../components/createTrade/Create";
import { useAccount } from "wagmi";
import ConnectBtnK from "../components/header/KitButton";

const Landing = () => {
  const { isConnected, isDisconnected } = useAccount();
  const [showConnect, setShowConnect] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

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
              {!isConnected ? (
                <div className={style.connectBtn}>
                  <ConnectBtnK />
                </div>
              ) : (
                <button className={style.createBtn} onClick={handleModals}>
                  Create Ad
                </button>
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
