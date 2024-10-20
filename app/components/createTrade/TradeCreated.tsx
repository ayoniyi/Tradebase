import Image from "next/image";
import style from "./Create.module.scss";

import Escrow from "./escrow.svg";
import Share from "./share.svg";
import { copyToClipboard } from "@/app/utils/copyToClipboard";
import Link from "next/link";

const TradeCreated = (props: any) => {
  const receivingAmount: any = props.userInput.tokenSalePrice * 0.99;
  const receivingAmountProd: any = props.userInput.productPrice * 0.99;
  return (
    <>
      {props.tradeOption === "Token swap" ? (
        <div className={style.tradeCreated}>
          <div className={style.tradeDesc}>
            <div className={style.tradeStatus}>
              <Image src={Escrow} alt="trade created" />
              <p>Trade created : Awaiting buyer's payment</p>
            </div>
            <p className={style.tradeTitle}>
              You have put up{" "}
              <span>
                {props.userInput.tokenSaleAmount +
                  " " +
                  props.userInput.tokenSelling}
              </span>{" "}
              for sale @ <span>{props.userInput.tokenSalePrice} ETH</span>{" "}
            </p>
            <div className={style.tradeTxt}>
              <p>
                Funds will be held in a latent wallet until buyer confirms
                receipt of tokens, the funds would be realeased to you
                thereafter.
              </p>
            </div>
          </div>
          <div className={style.tradeBreakdown}>
            <div className={style.breakRow}>
              <p>Token for sale</p>
              <p>{props.userInput.tokenSelling}</p>
            </div>
            <div className={style.breakRow}>
              <p>Token quantity for sale</p>
              <p>{props.userInput.tokenSaleAmount.toString()}</p>
            </div>
            <div className={style.breakRow}>
              <p>Price</p>
              <p>{props.userInput.tokenSalePrice.toString()} ETH</p>
            </div>
            <div className={style.breakRow}>
              <p>Fees</p>
              <p>1%</p>
            </div>
            <div className={style.breakRow}>
              <p>Seller receives</p>
              <p>{receivingAmount.toString()} ETH</p>
            </div>
          </div>
          <div className={style.shareBtns}>
            <button
              onClick={() =>
                copyToClipboard(
                  process.env.NEXT_PUBLIC_APP_URL + "/trade/" + props?.tradeId
                )
              }
              className={style.shareBtn}
            >
              <Image src={Share} alt="share" />
              Copy trade link
            </button>

            {props.userInput.tradeType === "Private sale" ? (
              <Link href={`/trade/${props?.tradeId}`}>
                <button className={style.viewBtn}>View on dashboard</button>
              </Link>
            ) : (
              <Link href={`/marketplace`}>
                <button className={style.viewBtn}>View in marketplace</button>
              </Link>
            )}
          </div>
        </div>
      ) : props.tradeOption === "Physical item" ||
        props.tradeOption === "Digital product" ? (
        <div className={style.tradeCreated}>
          <div className={style.trImg}>
            <Image
              src={URL.createObjectURL(props?.file?.item)}
              width={130}
              height={130}
              alt={props.userInput.productName}
            />
            <p>{props.userInput.productName}</p>
          </div>
          <div className={style.tradeDesc}>
            <div className={style.tradeStatus}>
              <Image src={Escrow} alt="trade created" />
              <p>Trade created </p>
            </div>
            <p className={style.tradeTitle}>
              You have put up <span>{props.userInput.productName}</span> for
              sale @ <span>{props.userInput.productPrice} ETH</span>{" "}
            </p>
            <div className={style.tradeTxt}>
              <p>
                Funds will be held in a latent wallet until buyer confirms
                receipt of product(s), the funds would be realeased to you
                thereafter.
              </p>
            </div>
          </div>
          <div className={style.tradeBreakdown}>
            <div className={style.breakRow}>
              <p>Product for sale</p>
              <p>{props.userInput.productName}</p>
            </div>

            <div className={style.breakRow}>
              <p>Price</p>
              <p>{props.userInput.productPrice.toString()} ETH</p>
            </div>
            <div className={style.breakRow}>
              <p>Fees</p>
              <p>1%</p>
            </div>
            <div className={style.breakRow}>
              <p>Seller receives</p>
              <p>{receivingAmountProd.toString()} ETH</p>
            </div>
          </div>
          <div className={style.shareBtns}>
            <button
              onClick={() =>
                copyToClipboard(
                  process.env.NEXT_PUBLIC_APP_URL + "/trade/" + props?.tradeId
                )
              }
              className={style.shareBtn}
            >
              <Image src={Share} alt="share" />
              Copy trade link
            </button>
            {props.userInput.tradeType === "Private sale" ? (
              <Link href={`/trade/${props?.tradeId}`}>
                <button className={style.viewBtn}>View on dashboard</button>
              </Link>
            ) : (
              <Link href={`/trade/${props?.tradeId}`}>
                <button className={style.viewBtn}>View on dashboard</button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default TradeCreated;
