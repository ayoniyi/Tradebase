import Image from "next/image";
import style from "./Create.module.scss";

import Escrow from "./escrow.svg";
import Share from "./share.svg";

const TradeCreated = (props: any) => {
  const receivingAmount: any = props.userInput.tokenSalePrice * 0.99;
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
              <p>{parseFloat(props.userInput.tokenSaleAmount).toFixed(2)}</p>
            </div>
            <div className={style.breakRow}>
              <p>Price</p>
              <p>{parseFloat(props.userInput.tokenSalePrice).toFixed(2)} ETH</p>
            </div>
            <div className={style.breakRow}>
              <p>Fees</p>
              <p>1%</p>
            </div>
            <div className={style.breakRow}>
              <p>Seller receives</p>
              <p>{parseFloat(receivingAmount).toFixed(2)} ETH</p>
            </div>
          </div>
          <div className={style.shareBtns}>
            {props.userInput.tradeType === "Private sale" ? (
              <button className={style.shareBtn}>
                <Image src={Share} alt="share" />
                Share link to buyer
              </button>
            ) : (
              <button className={style.shareBtn}>
                <Image src={Share} alt="share" />
                Share link
              </button>
            )}
            {props.userInput.tradeType === "Private sale" ? (
              <button className={style.viewBtn}>View on dashboard</button>
            ) : (
              <button className={style.viewBtn}>View in marketplace</button>
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
