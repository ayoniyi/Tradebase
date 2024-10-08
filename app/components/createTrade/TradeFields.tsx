import SelectToken from "../TextInput/SelectTokens";
import style from "./Create.module.scss";
import AnimatedTabs from "../tabs/Animatedtabs";

import Image from "next/image";
import bETH from "./beth.png";

const TradeFields = (props: any) => {
  //const tabs = ["Private sale", "Public sale"];
  return (
    <>
      <div className={style.tokenTrade}>
        {/* <h4>Token Swap</h4> */}
        <div className={style.tabsContainer}>
          <div
            className={
              props.userInput.tradeType === "Private sale"
                ? style.tab + " " + style.activeTab
                : style.tab
            }
            onClick={() => props.handleTradeType("Private sale")}
          >
            <p>Private sale</p>
          </div>
          <div
            className={
              props.userInput.tradeType === "Public sale"
                ? style.tab + " " + style.activeTab
                : style.tab
            }
            onClick={() => props.handleTradeType("Public sale")}
          >
            <p>Public sale</p>
          </div>
        </div>
        <div className={style.tokenFields}>
          <div className={style.tkField}>
            <div className={style.tkTop}>
              <p>I'm selling</p>
            </div>
            <div className={style.tkBody}>
              <SelectToken tokenHandler={props.tokenHandler} />
              <input
                className={style.tkVal}
                type="text"
                placeholder="0.00"
                name="tokenSaleAmount"
                onChange={props.inputHandler}
                value={props.userInput.tokenSaleAmount}
              />
            </div>
          </div>
          <div className={style.tkField}>
            <div className={style.tkTop}>
              <p>Buyer pays</p>
            </div>
            <div className={style.tkBody}>
              <div className={style.fixedTk}>
                <Image src={bETH} alt="base ethereum" />
                <p>ETH</p>
              </div>
              <input
                className={style.tkVal}
                type="text"
                placeholder="0.00"
                name="tokenSalePrice"
                onChange={props.inputHandler}
                value={props.userInput.tokenSalePrice}
              />
            </div>
          </div>

          <button className={style.createBtn} onClick={props.removeOption}>
            Create trade
          </button>
          <button className={style.backBtn} onClick={props.removeOption}>
            Go back
          </button>
        </div>
      </div>
    </>
  );
};

export default TradeFields;
