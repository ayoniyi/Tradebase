import React from "react";
import style from "./Card.module.scss";
import Image from "next/image";
import Link from "next/link";

const ProductCard = (props: any) => {
  return (
    <>
      <div className={style.cardBorder}>
        <div className={style.productCard}>
          <div className={style.productImg}>
            <Image
              src={props?.trade?.productImage}
              alt="product"
              width={200}
              height={100}
            />
          </div>
          <div className={style.productTxt}>
            <div className={style.productTitle}>
              <h3>{props?.trade?.productName}</h3>
            </div>
            <div className={style.productBtm}>
              <div className={style.productPrice}>
                <p>Price : {props?.trade?.price} ETH</p>
              </div>

              <Link
                className={style.productBtn}
                href={`/trade/${props?.trade?.userId || props?.trade?.id}`}
              >
                <button>{props?.cardAction}</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
