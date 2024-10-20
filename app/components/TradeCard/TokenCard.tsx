import React from "react";
import style from "./Card.module.scss";
import Link from "next/link";

const TokenCard = (props: any) => {
  return (
    <>
      <div className={style.cardBorder}>
        <div className={style.tokenCard}>
          <div className={style.tkContent}>
            {/* <div className={style.tkTop}>
              <div className={style.topRight}>
                <p>Token swap</p>
              </div>
            </div> */}
            <div className={style.tkTxt}>
              <p>
                {props?.trade?.amountOfToken +
                  " " +
                  props?.trade?.tokenToBeSold}
              </p>
              <p style={{ margin: ".4em 0" }}>@</p>
              <p>
                <p>{props?.trade?.price} ETH</p>
              </p>
            </div>

            <Link
              className={style.tkBtn}
              href={`/trade/${props?.trade?.userId}`}
            >
              <button>Buy</button>
            </Link>
            {/* <button onClick={() => props?.handleTrade(props?.trade)}>
                Buy
              </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenCard;
