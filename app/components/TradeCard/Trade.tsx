import React from "react";
import style from "./TradeCard.module.scss";
import Image from "next/image";

import Logo from "./smlogo.svg";
import Ex from "./ex.svg";
import Eth from "./ethlogo.svg";
import Arrow from "./rightArr.svg";
import Link from "next/link";

const TradeCard = (props: any) => {
  return (
    <>
      {props?.trade.tradeOption === "Token swap" ? (
        <div className={style.cardBorder}>
          <div className={style.card}>
            <div className={style.cardTop}>
              <div className={style.topLeft}>
                <Image src={Logo} alt="buylist" />

                <p>
                  {props?.trade?.amountOfToken +
                    " " +
                    props?.trade?.tokenToBeSold}
                </p>
              </div>
              <div className={style.topRight}>
                {/* <p>Tkn/Eth</p> */}
                <p>Token swap</p>
              </div>
            </div>
            <div className={style.cardTxt}>
              {/* <p>4000 BUY</p> */}
              <p>Sale Price</p>
              {/* <Image src={Ex} alt="exchange" /> */}

              <div className={style.amount}>
                {/* <Image src={Eth} alt="token" />
              <p>2000 BUSD</p> */}
                {/* <p>{props.trade.amount} USDT</p> */}
                <p>{props?.trade?.price} ETH</p>
              </div>
            </div>
            <div className={style.cardArrBorder}>
              {/* <Link
                href={"/marketplace/" + props?.trade?.id}
                className={style.cardArrow}
                
              >
                <Image src={Arrow} alt="arrow" />
              </Link> */}
              <div
                className={style.cardArrow}
                onClick={() => props?.handleTrade(props?.trade)}
              >
                <Image src={Arrow} alt="arrow" />
              </div>
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
