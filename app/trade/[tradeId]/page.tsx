"use client";
import React from "react";
import style from "./TradePage.module.scss";
import Image from "next/image";

import Escrow from "../escrow.svg";
import Header from "@/app/components/header/Header";
import { useParams } from "next/navigation";
import { useDocQuery } from "@/app/utils/functions/firebaseFunctions";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

const SingleTrade = () => {
  const tradeId = useParams()?.tradeId;

  //const docRef = collection(db, "trades");
  const docRef = doc(db, `trades/${tradeId}`);
  const docsQuery = useDocQuery(["trades", tradeId], docRef);
  const tradeInfo = docsQuery?.data?.data();
  console.log(tradeInfo, "trade>>>");
  return (
    <>
      <Header />
      <div className={style.container}>
        <div className={style.cardBorder}>
          <div className={style.tradeBox}>
            <div className={style.tradeCreated}>
              <div className={style.tradeDesc}>
                <div className={style.tradeStatus}>
                  <Image src={Escrow} alt="trade created" />
                  <p>Buy Token</p>
                </div>
                <p className={style.tradeTitle}>
                  <span>
                    {tradeInfo?.amountOfToken + " " + tradeInfo?.tokenToBeSold}
                  </span>{" "}
                  for sale @ <span>{tradeInfo?.price} ETH</span>{" "}
                </p>
                <div className={style.tradeTxt}>
                  <p>
                    Funds will be held in a latent wallet until you confirm
                    receipt of tokens, the funds would be realeased to the
                    seller thereafter.
                  </p>
                </div>
              </div>
              <div className={style.tradeBreakdown}>
                <div className={style.breakRow}>
                  <p>Token for sale</p>
                  <p>{tradeInfo?.tokenToBeSold}</p>
                </div>
                <div className={style.breakRow}>
                  <p>Token quantity for sale</p>
                  <p>{parseFloat(tradeInfo?.amountOfToken).toFixed(2)}</p>
                </div>
                <div className={style.breakRow}>
                  <p>Price</p>
                  <p>{parseFloat(tradeInfo?.price).toFixed(2)} ETH</p>
                </div>
              </div>
              <div className={style.shareBtns}>
                <button
                //onClick={createEscrow} className={style.shareBtn}
                >
                  Create escrow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleTrade;
