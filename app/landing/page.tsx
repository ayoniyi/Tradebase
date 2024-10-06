"use client";
import React, { useState } from "react";
import Header from "@/app/components/header/Header";
import style from "./Landing.module.scss";
import Image from "next/image";
import heroImg from "./hero.png";
import Connect from "../components/connectWallet/Connect";

const Landing = () => {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  return (
    <>
      <Header />
      {showModal && <Connect handleClose={handleClose} />}
      <div className={style.hero}>
        <div className={style.heroContent}>
          <div className={style.heroDesc}>
            <div className={style.heroTxt}>
              <h1>
                The base network's <span> P2P marketplace</span>
              </h1>
              <p>Secure trades with built-in escrow on the base network</p>
              <button onClick={() => setShowModal(true)}>Create trade</button>
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
