import SelectToken from "../TextInput/SelectTokens";
import style from "./Create.module.scss";
import TextInput from "../TextInput/TextInput";
import { CircularProgress, IconButton } from "@mui/material";
import { Trash } from "../Icons";

import Image from "next/image";
import bETH from "./beth.png";
import TextArea from "../TextInput/TextArea";
import Upload from "./upload.svg";

const TradeFields = (props: any) => {
  return (
    <>
      {props.tradeOption === "Token swap" ? (
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
                <SelectToken tokenHandler={props?.tokenHandler} />
                <input
                  className={style.tkVal}
                  type="text"
                  placeholder="0.00"
                  name="tokenSaleAmount"
                  onChange={props.inputHandler}
                  value={props?.userInput?.tokenSaleAmount}
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
                  value={props?.userInput?.tokenSalePrice}
                />
              </div>
            </div>

            {props.userInput.tradeType === "Private sale" ? (
              <button
                disabled={
                  !props.isValidated ||
                  props.tradeMutation.isPending ||
                  props.fileMutation.isPending
                }
                className={style.createBtn}
                onClick={props.createTrade}
              >
                {props.tradeMutation.isPending ||
                props.fileMutation.isPending ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "Create trade"
                )}
              </button>
            ) : props.userInput.tradeType === "Public sale" ? (
              <button
                disabled={
                  !props.isValidated ||
                  props.tradeMutation.isPending ||
                  props.fileMutation.isPending
                }
                className={style.createBtn}
                onClick={props.createTrade}
              >
                {props.tradeMutation.isPending ||
                props.fileMutation.isPending ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "Create ad"
                )}
              </button>
            ) : (
              ""
            )}

            <button className={style.backBtn} onClick={props.removeOption}>
              Go back
            </button>
          </div>
        </div>
      ) : props.tradeOption === "Physical item" ? (
        <div className={style.productTrade}>
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
          <div className={style.productFields}>
            <div className={style.uploadContainer}>
              <p>Upload product image</p>
              <div className={style.uploadBx} {...props?.rootProps}>
                <input
                  type="text"
                  style={{
                    height: "400px",
                    width: "400px",
                  }}
                  {...props?.inputProps}
                />
                {!props?.file.item ? (
                  <>
                    <Image
                      className={style.uploadIcon}
                      src={Upload}
                      alt="upload"
                    />

                    <p className={style.uploadTxtOne}>
                      <span> Click to upload</span> or drag and drop
                    </p>
                    <p className={style.uploadTxtTwo}>Maximum size: 10MB</p>
                    {/* {isDragActive && <p>Drop your file here</p>} */}
                  </>
                ) : (
                  <>
                    <IconButton
                      sx={{
                        position: "absolute",
                        zIndex: "2",
                        right: "10px",
                        top: "5px",
                        color: "#000",
                        height: "40px",

                        fontSize: "30px",
                        textTransform: "none",
                        transition: ".2s ease in",
                        ":hover": {
                          background: "#fff",
                        },
                      }}
                      aria-label="delete"
                      onClick={() => props.handleFile(null, null)}
                    >
                      <Trash />
                    </IconButton>
                    <Image
                      className={style.fileImg}
                      src={URL.createObjectURL(props?.file?.item)}
                      alt="product image"
                      width={130}
                      height={130}
                    />
                  </>
                )}
              </div>
            </div>
            <TextInput
              labelName="Product name"
              inputName="productName"
              type="text"
              placeHolder="Enter product name"
              ariaLabel="product name"
              value={props?.userInput?.productName}
              inputHandler={props.inputHandler}
            />
            <TextArea
              labelName="Product description"
              inputName="description"
              placeHolder="Enter product description"
              ariaLabel="product description"
              value={props?.userInput?.description}
              inputHandler={props.inputHandler}
            />
            <TextInput
              labelName="Price (ETH)"
              inputName="productPrice"
              type="text"
              placeHolder="Enter price"
              ariaLabel="product price"
              value={props?.userInput?.productPrice}
              inputHandler={props.inputHandler}
            />
            {props.userInput.tradeType === "Private sale" ? (
              <button
                className={style.createBtn}
                disabled={
                  !props.isValidated ||
                  props.tradeMutation.isPending ||
                  props.fileMutation.isPending
                }
                onClick={props.createTrade}
              >
                {props.tradeMutation.isPending ||
                props.fileMutation.isPending ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "Create trade"
                )}
              </button>
            ) : props.userInput.tradeType === "Public sale" ? (
              <button
                className={style.createBtn}
                disabled={
                  !props.isValidated ||
                  props.tradeMutation.isPending ||
                  props.fileMutation.isPending
                }
                onClick={props.createTrade}
              >
                {props.tradeMutation.isPending ||
                props.fileMutation.isPending ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "Create ad"
                )}
              </button>
            ) : (
              ""
            )}

            <button className={style.backBtn} onClick={props.removeOption}>
              Go back
            </button>
          </div>
        </div>
      ) : props.tradeOption === "Digital product" ? (
        <div className={style.productTrade}>
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
          <div className={style.productFields}>
            <div className={style.uploadContainer}>
              <p>Upload product image</p>
              <div className={style.uploadBx} {...props?.rootProps}>
                <input
                  type="text"
                  style={{
                    height: "400px",
                    width: "400px",
                  }}
                  {...props?.inputProps}
                />
                {!props?.file.item ? (
                  <>
                    <Image
                      className={style.uploadIcon}
                      src={Upload}
                      alt="upload"
                    />

                    <p className={style.uploadTxtOne}>
                      <span> Click to upload</span> or drag and drop
                    </p>
                    <p className={style.uploadTxtTwo}>Maximum size: 10MB</p>
                    {/* {isDragActive && <p>Drop your file here</p>} */}
                  </>
                ) : (
                  <>
                    <IconButton
                      sx={{
                        position: "absolute",
                        zIndex: "2",
                        right: "10px",
                        top: "5px",
                        color: "#000",
                        height: "40px",

                        fontSize: "30px",
                        textTransform: "none",
                        transition: ".2s ease in",
                        ":hover": {
                          background: "#fff",
                        },
                      }}
                      aria-label="delete"
                      onClick={() => props.handleFile(null, null)}
                    >
                      <Trash />
                    </IconButton>
                    <Image
                      className={style.fileImg}
                      src={URL.createObjectURL(props?.file?.item)}
                      alt="product image"
                      width={130}
                      height={130}
                    />
                  </>
                )}
              </div>
            </div>
            <TextInput
              labelName="Product name"
              inputName="productName"
              type="text"
              placeHolder="Enter product name"
              ariaLabel="product name"
              value={props?.userInput?.productName}
              inputHandler={props.inputHandler}
            />
            <TextArea
              labelName="Product description"
              inputName="description"
              placeHolder="Enter product description"
              ariaLabel="product description"
              value={props?.userInput?.description}
              inputHandler={props.inputHandler}
            />
            <TextInput
              labelName="Price (ETH)"
              inputName="productPrice"
              type="text"
              placeHolder="Enter price"
              ariaLabel="product price"
              value={props?.userInput?.productPrice}
              inputHandler={props.inputHandler}
            />
            {props.userInput.tradeType === "Private sale" ? (
              <button
                className={style.createBtn}
                disabled={
                  !props.isValidated ||
                  props.tradeMutation.isPending ||
                  props.fileMutation.isPending
                }
                onClick={props.createTrade}
              >
                {props.tradeMutation.isPending ||
                props.fileMutation.isPending ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "Create trade"
                )}
              </button>
            ) : props.userInput.tradeType === "Public sale" ? (
              <button
                className={style.createBtn}
                disabled={
                  !props.isValidated ||
                  props.tradeMutation.isPending ||
                  props.fileMutation.isPending
                }
                onClick={props.createTrade}
              >
                {props.tradeMutation.isPending ||
                props.fileMutation.isPending ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : (
                  "Create ad"
                )}
              </button>
            ) : (
              ""
            )}

            <button className={style.backBtn} onClick={props.removeOption}>
              Go back
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default TradeFields;
