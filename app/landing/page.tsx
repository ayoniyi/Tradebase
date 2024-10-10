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

  // console.log(isConnected, "isConnected");

  /// -----
  // export const contact = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const { ethereum } = window;

  //   if (ethereum) {
  //     const signer = provider.getSigner();

  //     const contractReader = new ethers.Contract(
  //       STAKING_DAPP_ADDRESS,
  //       StakingDappABI.abi,
  //       signer
  //     );

  //     return contractReader;
  //   }
  // };
  ///// ----

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

      <Header />
      <div className={style.hero}>
        <div className={style.heroContent}>
          <div className={style.heroDesc}>
            <div className={style.heroTxt}>
              <h1>
                The base network's <span> P2P marketplace</span>
              </h1>
              <p>Secure trades with built-in escrow on the base network</p>

              <button onClick={handleModals}>Create trade</button>
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
