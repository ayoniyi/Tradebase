import React from "react";
import style from "./TradeCard.module.scss";
import Image from "next/image";

import Ex from "./ex.svg";
import Eth from "./ethlogo.svg";
import Arrow from "./rightArr.svg";
import Link from "next/link";

const TradeCard = (props: any) => {
  return (
    <>
      {props?.trade.tradeOption === "Token swap" ? (
        <div>
          <div className={style.card}>
            <div className={style.cardTop}>
              <div className={style.topLeft}>
                <p>
                  {props?.trade?.amountOfToken +
                    " " +
                    props?.trade?.tokenToBeSold}
                </p>
              </div>
              <div className={style.topRight}>
                <p>Token swap</p>
              </div>
            </div>
            <div className={style.cardTxt}>
              <p>Sale Price</p>

              <div className={style.amount}>
                <p>{props?.trade?.price} ETH</p>
              </div>
            </div>
            <div className={style.cardBtn}>
              <button> Buy</button>
            </div>
          </div>
        </div>
      ) : (
        <div className={style.cardBorder}></div>
      )}
    </>
  );
};

export default TradeCard;
