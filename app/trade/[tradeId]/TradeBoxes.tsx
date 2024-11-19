import React from "react";
import style from "./Trade.module.scss";
import Link from "next/link";
import { shortenHex } from "@/app/utils/formatting";
import { CircularProgress } from "@mui/material";
import Image from "next/image";

import warn from "./warn.svg";
import send from "./send.svg";
import Seller from "./seller.svg";
import You from "./you.svg";
import clock from "./clock.svg";

const TradeBoxes = ({
  tradeInfo,
  userState,
  balance,
  messages,
  ref,
  handleSend,
  messageTxt,
  handleMsgTxt,
  isLoading,
}: any) => {
  return (
    <div className={style.boxesContent}>
      <div className={style.tradeBoxes}>
        <div className={style.tradeProcess}>
          <div className={style.top}>
            <Link href="/marketplace">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http:www.w3.org/2000/svg"
              >
                <path
                  d="M2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L6.29289 7.29289C6.68342 6.90237 7.31658 6.90237 7.70711 7.29289C8.09763 7.68342 8.09763 8.31658 7.70711 8.70711L5.41421 11L21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13L5.41421 13L7.70711 15.2929C8.09763 15.6834 8.09763 16.3166 7.70711 16.7071C7.31658 17.0976 6.68342 17.0976 6.29289 16.7071L2.29289 12.7071Z"
                  fill="black"
                />
              </svg>
            </Link>
            <h2>{tradeInfo?.tradeOption}</h2>
          </div>
          <div className={style.escBox}>
            <div className={style.escTxt}>
              <p>In escrow</p>
              <h3>
                {tradeInfo?.tradeBalance && tradeInfo?.tradeBalance !== 0
                  ? tradeInfo?.tradeBalance
                  : balance}{" "}
                <span>ETH</span>
              </h3>
            </div>
            <div className={style.escBtn}>
              <button>Make payment</button>
            </div>
          </div>
          <div className={style.sellerBox}>
            <Image src={Seller} alt="seller" />
            <p>Seller {shortenHex(tradeInfo?.sellerAddress) + " "}&nbsp; </p>
            <span> +&nbsp; </span>
            <Image className={style.ml4} src={You} alt="you" />
            <span>You</span>
          </div>
          <div className={style.statusTxt}>
            <Image src={clock} alt="clock" />
            <p>Escrow created : seller waiting for your payment</p>
          </div>
          <div className={style.tradeTxt}>
            <p className={style.introTxt}>
              You will pay&nbsp;
              <span>{tradeInfo?.price} ETH </span> for &nbsp;
              <span>
                {tradeInfo?.amountOfToken + " " + tradeInfo?.tokenToBeSold}
              </span>{" "}
            </p>
            <p className={style.tradeDesc} style={{ width: "100%" }}>
              This order will be canceled if you don't make payment to your
              wallet within 10mins
            </p>
          </div>
          <div className={style.tradeBreakdown}>
            <div className={style.breakRow}>
              <p>Token for sale</p>
              <p>{tradeInfo?.tokenToBeSold}</p>
            </div>
            <div className={style.breakRow}>
              <p>Token quantity for sale</p>
              <p>{tradeInfo?.amountOfToken.toString()}</p>
            </div>
            <div className={style.breakRow}>
              <p>Price</p>
              <p>{tradeInfo?.price.toString()} ETH</p>
            </div>
            <div className={style.breakRow}>
              <p>Fees</p>
              <p>1 %</p>
            </div>
          </div>
        </div>
        <div className={style.chatBx}>
          <div className={style.chatTop}>
            <h3>Chat with seller</h3>
            <div className={style.addressBox}>
              <>
                <svg
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http:www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5 16.6668H5.5C4.11929 16.6668 3 15.5475 3 14.1668V5.18746C3 4.16355 3.83005 3.3335 4.85397 3.3335H10.5115C10.9085 3.3335 11.2368 3.95043 11.5535 4.62516H5.5C5.03976 4.62516 4.66667 4.99826 4.66667 5.4585C4.66667 5.91873 5.03976 6.29183 5.5 6.29183H12.5742L12.5833 6.29646H15.5008C16.8815 6.29646 18 7.41575 18 8.79646V9.16683H16.3333C14.9526 9.16683 13.8333 10.2861 13.8333 11.6668C13.8333 13.0475 14.9526 14.1668 16.3333 14.1668H18C18 15.5475 16.8807 16.6668 15.5 16.6668Z"
                    fill="#1671D9"
                  />
                  <path
                    d="M18 12.5002V10.8335H16.3333C15.8731 10.8335 15.5 11.2066 15.5 11.6668C15.5 12.1271 15.8731 12.5002 16.3333 12.5002H18Z"
                    fill="#1671D9"
                  />
                </svg>
                <p>{shortenHex(tradeInfo?.sellerAddress)}</p>
              </>
            </div>
          </div>
          <Image src={warn} alt="warning" className={style.warning} />
          <div className={style.chatMessages}>
            {messages?.map((m: any) => (
              <div
                ref={ref}
                className={
                  m.senderId === userState?.user?.userId
                    ? style.messageBoxOwner
                    : style.messageBoxOther
                }
                key={m.mId}
              >
                <div
                  className={
                    m.senderId === userState?.user?.userId
                      ? style.messageOwner
                      : style.messageOther
                  }
                >
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form className={style.chatInput} onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type a message"
              onChange={(e: any) => handleMsgTxt(e.target.value)}
              value={messageTxt}
              required
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <Image src={send} alt="send" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TradeBoxes;
