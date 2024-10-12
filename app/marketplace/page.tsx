"use client";
import React, { useState } from "react";
import style from "./Marketplace.module.scss";
import Header from "../components/header/Header";
import TradeCard from "../components/TradeCard/Trade";
import { fetchDocsQuery } from "../utils/functions/firebaseFunctions";
import { collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import TradeModal from "./TradeModal";
import { AnimatePresence } from "framer-motion";

const Marketplace = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentTrade, setCurrentTrade] = useState<any>();
  //fetch trades
  const tradesCollectionRef = collection(db, "trades");
  const tradesQuery = fetchDocsQuery(["tradesQuery"], tradesCollectionRef);
  //console.log(tradesQuery?.data, "trades>>");
  const handleTrade = (trade: any) => {
    setCurrentTrade(trade);
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showModal && (
          <TradeModal currentTrade={currentTrade} handleClose={handleClose} />
        )}
      </AnimatePresence>
      <Header />
      <div className={style.container}>
        <div className={style.content}>
          <h2>Trades</h2>
          <div className={style.tradeGrid}>
            {tradesQuery?.data?.map((trade: any) => (
              <TradeCard
                key={trade?.userId}
                trade={trade}
                handleTrade={handleTrade}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Marketplace;
