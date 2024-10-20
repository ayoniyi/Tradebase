import { use, useCallback, useContext, useState } from "react";
import style from "./Create.module.scss";
import { motion } from "framer-motion";
import { createFunc, overlayFunc } from "@/app/utils/motion";
import { useDisconnect } from "wagmi";
import { shortenHex } from "@/app/utils/formatting";
import { useAccount } from "wagmi";
import { UserContext } from "@/app/context/UserContext";
//import SelectField from "../TextInput/Select";
import TradeFields from "./TradeFields";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

import Token from "./token.svg";
import Digital from "./digital.svg";
import Physical from "./physical.svg";
import TradeCreated from "./TradeCreated";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import {
  useFileUpload,
  useSetDoc,
} from "@/app/utils/functions/firebaseFunctions";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import upload from "@/app/utils/upload";

const Create = (props: any) => {
  const { address } = useAccount();
  const [userState] = useContext<any>(UserContext);
  const [showDisconnect, setShowDisconnect] = useState(false);
  const { disconnect } = useDisconnect();
  const [tradeOption, setTradeOption] = useState("");
  const [tradeCreated, setTradeCreated] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [progress, setProgress] = useState();
  const [tradeId, setTradeId] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  //console.log("user>>", userState);

  interface Trade {
    tokenSelling: string;
    tokenSaleAmount: number | null;
    tokenSalePrice: number | null;
    tradeType: string;
    productName: string;
    productImageLink: string;
    description: string;
    productPrice: number | null;
  }

  const [userInput, setUserInput] = useState<Trade>({
    // for tokens
    tokenSelling: "", // token user is selling
    tokenSaleAmount: 0.0, // amount of token user is selling
    tokenSalePrice: 0.0, // price seller receives for token,
    tradeType: "Private sale", // public or private

    // for physical or digital products
    productName: "",
    productImageLink: "",
    description: "",
    productPrice: 0,
  });
  const [file, setFile] = useState({
    parent: null,
    item: null,
  });

  const removeOption = () => {
    setTradeOption("");
  };

  const inputHandler = (event: any) => {
    const { name, value } = event.target;

    if (name === "tokenSaleAmount" || name === "tokenSalePrice") {
      let letters = /[a-zA-Z]/;
      let specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
      let dots = value.match(/\./g);
      let sanitzedValue = value.replace(/\s+/g, "");
      if (
        letters.test(value) ||
        specialChars.test(value) ||
        dots?.length >= 2 ||
        value.length > 12
      ) {
        //console.log(value);
      } else {
        const updatedInputs = {
          ...userInput,
          [name]: sanitzedValue,
        };
        setUserInput(updatedInputs);
        const isFormValid =
          updatedInputs.tokenSaleAmount! > 0 &&
          updatedInputs.tokenSalePrice! > 0;

        setIsValidated(isFormValid);
      }
    } else if (name === "productPrice") {
      let letters = /[a-zA-Z]/;
      let specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
      let dots = value.match(/\./g);
      let sanitzedValue = value.replace(/\s+/g, "");
      if (
        letters.test(value) ||
        specialChars.test(value) ||
        dots?.length >= 2 ||
        value.length > 12
      ) {
        //console.log(value);
      } else {
        const updatedInputs = {
          ...userInput,
          [name]: sanitzedValue,
        };
        setUserInput(updatedInputs);
        const isFormValid = updatedInputs.productPrice! > 0;
        setIsValidated(isFormValid);
      }
    } else {
      setUserInput({
        ...userInput,
        [event.target.name]: event.target.value,
      });
    }
  };

  const tokenHandler = (selectedOption: any) => {
    setUserInput({
      ...userInput,
      tokenSelling: selectedOption.symbol,
    });
  };

  const handleTradeType = (type: string) => {
    setUserInput({
      ...userInput,
      tradeType: type,
    });
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    //console.log("size", acceptedFiles);
    //  console.log("size", acceptedFiles);
    setFile({
      parent: acceptedFiles,
      item: acceptedFiles[0],
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleFile = (parent: any, item: any) => {
    setFile({
      parent: parent || null,
      item: item || null,
    });
  };

  const queryClient = useQueryClient();

  const tradeSucess = () => {
    toast.success("Trade created successfully", {
      duration: 4500,
    });
    queryClient.invalidateQueries({ queryKey: ["tradesQuery"] });
    setTradeCreated(true);
  };

  const newTradeRef = collection(db, "trades");
  //const tradeMutation = useSetDoc(newTradeRef, tradeSucess);
  const tradeMutation = useMutation({
    mutationFn: async (info: any) => addDoc(newTradeRef, info),
    onError: (err) => {
      console.log("err", err);
      toast.error("Sorry, an error occured.", {
        duration: 6500,
      });
    },

    onSuccess: (res) => {
      console.log("app res", res?.id);
      setTradeId(res?.id);
      tradeSucess();
      //return res;
    },
  });

  const fileMutation = useMutation({
    mutationFn: async () => upload(file.item, setProgress),
    onError: (err) => {
      console.log("err", err);
      toast.error("Sorry, an error occured", {
        duration: 6500,
      });
    },
    onSuccess: (res: any) => {
      console.log("url res", res?.id);
      console.log("progress", progress);
      setFileUrl(res);
      const { productName, tradeType, description, productPrice } = userInput;
      const { userId, name, email } = userState?.user;
      const tradeInfo = {
        tradeOption: tradeOption,
        tradeType: tradeType,
        productName: productName,
        productImage: res,
        description: description,
        price: productPrice,
        sellerId: userId,
        sellerName: name,
        sellerAddress: userState?.user?.address,
        sellerEmail: email,
        status: "available",
      };
      tradeMutation.mutate(tradeInfo);
      //console.log("tm", tradeMutation, "tm data", tradeMutation?.data);
    },
  });

  const createTrade = (e: any) => {
    e.preventDefault();
    // create trade here

    if (tradeOption === "Token swap") {
      if (userInput.tokenSelling === "") {
        toast.error("Please select a token to sell.", {
          duration: 4500,
        });
      } else {
        const { tokenSaleAmount, tokenSalePrice, tokenSelling, tradeType } =
          userInput;
        const { userId, name, address, email } = userState?.user;
        const tradeInfo = {
          tradeOption: "Token swap",
          tradeType: tradeType,
          tokenToBeSold: tokenSelling,
          amountOfToken: tokenSaleAmount,
          price: tokenSalePrice,
          sellerId: userId,
          sellerName: name,
          sellerAddress: address,
          sellerEmail: email,
          status: "available",
        };
        tradeMutation.mutate(tradeInfo);
        // console.log("tm", tradeMutation, "tm data", tradeMutation?.data);
      }
    } else if (
      tradeOption === "Physical item" ||
      tradeOption === "Digital product"
    ) {
      if (
        userInput.productName === "" ||
        userInput.description === "" ||
        file.item === null
      ) {
        toast.error("Please fill out all the fields.", {
          duration: 4500,
        });
      } else {
        fileMutation.mutate();
      }
    }
  };

  return (
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
          tradeOption === "Physical item" || tradeOption === "Digital product"
            ? style.modalLong
            : style.modal
        }
        key="modal"
        variants={createFunc}
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
                  <p>{shortenHex(address)}</p>
                </>
              ) : (
                <p>Disconnect</p>
              )}
            </div>
            {tradeOption !== "" ? (
              <p className={style.optionTitle}>{tradeOption}</p>
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

          {tradeOption === "" ? (
            <div className={style.modalTrade}>
              <h3>What type of trade is this?</h3>
              <div className={style.tradeOptions}>
                <div
                  onClick={() => setTradeOption("Token swap")}
                  className={style.tradeOption}
                >
                  <Image src={Token} alt="token" />
                  <h4 className={style.tokenOpt}>Token swap</h4>
                  <p>Trade tokens securely using our escrow services.</p>
                </div>
                <div
                  onClick={() => setTradeOption("Physical item")}
                  className={style.tradeOption}
                >
                  <Image src={Physical} alt="physical item" />

                  <h4 className={style.physicalOpt}>Physical item</h4>
                  <p>Securely purchase physical items with our escrow.</p>
                </div>
                <div
                  onClick={() => setTradeOption("Digital product")}
                  className={style.tradeOption}
                >
                  <Image src={Digital} alt="digital products" />

                  <h4 className={style.digitalOpt}>Digital product</h4>
                  <p>Securely purchase digital items with our escrow.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={style.modalTrade}>
              {!tradeCreated ? (
                <TradeFields
                  tradeOption={tradeOption}
                  removeOption={removeOption}
                  inputHandler={inputHandler}
                  tokenHandler={tokenHandler}
                  userInput={userInput}
                  handleTradeType={handleTradeType}
                  rootProps={{ ...getRootProps() }}
                  inputProps={{ ...getInputProps() }}
                  handleFile={handleFile}
                  file={file}
                  isValidated={isValidated}
                  tradeMutation={tradeMutation}
                  fileMutation={fileMutation}
                  createTrade={createTrade}
                />
              ) : (
                <div className={style.created}></div>
              )}
            </div>
          )}
          {tradeCreated && (
            <TradeCreated
              tradeOption={tradeOption}
              userInput={userInput}
              file={file}
              tradeId={tradeId}
            />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Create;
