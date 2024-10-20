import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  createFunc,
  modalFunc,
  modalFunc2,
  overlayFunc,
} from "@/app/utils/motion";
import style from "./Modal.module.scss";
import { shortenHex } from "../utils/formatting";
import { useDisconnect } from "wagmi";
import { useAccount } from "wagmi";
import Image from "next/image";

import Escrow from "./escrow.svg";

import Link from "next/link";

const TradeModal = (props: any) => {
  const { address } = useAccount();
  const [showDisconnect, setShowDisconnect] = useState(false);
  const { disconnect } = useDisconnect();

  return (
    //This is what the buyer sees
    <>
      <motion.div
        className={style.overlay}
        key="overlay"
        onClick={props.handleClose}
        variants={overlayFunc}
        initial="hidden"
        animate="visible"
        exit="exit"
      ></motion.div>

      <motion.div
        className={
          props.currentTrade?.tradeOption === "Physical item" ||
          props?.setCurrentTrade?.tradeOption === "Digital product"
            ? style.modal
            : style.modal
        }
        key="modal"
        variants={modalFunc2}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className={style.modalContent}>
          <div className={style.modalTop2}>
            <div
              onClick={disconnect}
              className={style.connectedBx}
              onMouseEnter={(e) => setShowDisconnect(true)}
              onMouseLeave={(e) => setShowDisconnect(false)}
            >
              {!showDisconnect ? (
                <>
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <p>{address ? shortenHex(address) : "Connect wallet"}</p>
                </>
              ) : (
                <p>Disconnect</p>
              )}
            </div>
            {props?.currentTrade?.tradeOption !== "" ? (
              <p className={style.optionTitle}>
                {props?.currentTrade?.tradeOption}
              </p>
            ) : (
              ""
            )}
            <svg
              onClick={props.handleClose}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.2913 2.17725L13.8226 0.708496L7.99967 6.53141L2.17676 0.708496L0.708008 2.17725L6.53092 8.00016L0.708008 13.8231L2.17676 15.2918L7.99967 9.46891L13.8226 15.2918L15.2913 13.8231L9.46842 8.00016L15.2913 2.17725Z"
                fill="#1F1F1F"
              />
            </svg>
          </div>

          {props?.currentTrade?.tradeOption === "Token swap" ? (
            <div className={style.tradeCreated}>
              <div className={style.tradeDesc}>
                <div className={style.tradeStatus}>
                  <Image src={Escrow} alt="trade created" />
                  <p>Buy Token</p>
                </div>
                <p className={style.tradeTitle}>
                  <span>
                    {props?.currentTrade?.amountOfToken +
                      " " +
                      props?.currentTrade?.tokenToBeSold}
                  </span>{" "}
                  for sale @ <span>{props?.currentTrade?.price} ETH</span>{" "}
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
                  <p>{props?.currentTrade?.tokenToBeSold}</p>
                </div>
                <div className={style.breakRow}>
                  <p>Token quantity for sale</p>
                  <p>
                    {parseFloat(props?.currentTrade?.amountOfToken).toFixed(4)}
                  </p>
                </div>
                <div className={style.breakRow}>
                  <p>Price</p>
                  <p>{parseFloat(props?.currentTrade?.price).toFixed(4)} ETH</p>
                </div>
              </div>
              <div className={style.shareBtns}>
                <Link href={`/trade/${props?.currentTrade?.userId}`}>
                  <button className={style.shareBtn}>Open trade</button>
                </Link>

                {/* <button onClick={depositAmount} className={style.shareBtn}>
                  Deposit amount
                </button>
                <button onClick={releaseFunds} className={style.shareBtn}>
                  Release funds
                </button>
                <button className={style.viewBtn}>Cancel</button> */}
              </div>
            </div>
          ) : props?.currentTrade?.tradeOption === "Physical item" ||
            props?.currentTrade?.tradeOption === "Digital product" ? (
            <div className={style.tradeCreated}>
              <div className={style.trImg}>
                <Image
                  src={props?.currentTrade?.productImage}
                  width={130}
                  height={130}
                  alt={props?.currentTrade?.productImage}
                />
                <p>{props?.currentTrade?.productName}</p>
              </div>
              <div className={style.tradeDesc}>
                <div className={style.tradeStatus}>
                  <Image src={Escrow} alt="trade created" />
                  <p>Buy Product</p>
                </div>
                <p className={style.tradeTitle}>
                  <span>{props?.currentTrade?.productName}</span> for sale @{" "}
                  <span>{props?.currentTrade?.price} ETH</span>{" "}
                </p>
                <div className={style.tradeTxt}>
                  <p>
                    Funds will be held in a latent wallet until you confirm
                    receipt of product(s), the funds would be realeased to the
                    seller thereafter.
                  </p>
                </div>
              </div>
              <div className={style.tradeBreakdown}>
                <div className={style.breakRow}>
                  <p>Product for sale</p>
                  <p>{props?.currentTrade?.productName}</p>
                </div>

                <div className={style.breakRow}>
                  <p>Price</p>
                  <p>{parseFloat(props?.currentTrade?.price).toFixed(4)} ETH</p>
                </div>
              </div>
              <div className={style.shareBtns}>
                <button className={style.shareBtn}>Create escrow</button>
                {/* <button className={style.viewBtn}>Cancel</button> */}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </motion.div>
    </>
  );
};

export default TradeModal;
