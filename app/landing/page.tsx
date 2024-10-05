import React from "react";
import Header from "@/app/components/header/Header";
import style from "./Landing.module.scss";
import Image from "next/image";
import heroImg from "./hero.png";

const Landing = () => {
  return (
    <>
      <Header />
      <div className={style.hero}>
        <div className={style.heroContent}>
          <div className={style.heroDesc}>
            <div className={style.heroTxt}>
              <h1>
                The base network's <span> P2P marketplace</span>
              </h1>
              <p>Secure trades with built-in escrow on the base network</p>
              <button>Create trade</button>
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
