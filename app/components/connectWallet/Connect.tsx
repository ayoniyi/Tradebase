"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import style from "./Connect.module.scss";
import Image from "next/image";
import { motion } from "framer-motion";
import { modalFunc, overlayFunc } from "@/app/utils/motion";
import { UserContext } from "@/app/context/UserContext";

//import Logo from "@/app/logo.svg";
import Metamask from "./metamask.svg";
import Wc from "./wc.svg";
import Coinbase from "./coinbase.svg";
import Success from "./success.svg";
import { shortenHex } from "@/app/utils/formatting";

import TextInput from "../TextInput/TextInput";
import { use, useCallback, useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import {
  useDocsQuery,
  useSetDoc,
} from "@/app/utils/functions/firebaseFunctions";
//import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Connect = (props: any) => {
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [email, setEmail] = useState("");
  const [userState, setUserState] = useContext<any>(UserContext);
  //const account = useAccount();
  const { address, isConnected, connector: activeConnector } = useAccount();

  const { disconnect } = useDisconnect();

  const { connectors, connect, status, error, isLoading, pendingConnector } =
    useConnect();
  //{
  // onSuccess: (data: any) => {
  //   alert("connect");
  //   console.log("data", data);
  //   // if (data.chain.unsupported) {
  //   //   disconnect();
  //   //   toast.error(`Chain not supported, please switch to supported chain`, {
  //   //     duration: 3000,
  //   //   });
  //   // } else {
  //   //   toast.success(`Wallet connected successfully. `, { duration: 5000 });
  //   //   //setIsChainSupported(true);
  //   // }
  //   console.log("Connect", data);
  // },
  // onError: (error: any) => {
  //   alert("connect???");
  //   console.log("Error", error);
  // },
  // onSettled: (data: any, error: any) => {
  //   alert("connect!!");
  //   console.log("Connection attempt settled. Data:", data, "Error:", error);
  // },
  // onSuccess: (data: any) => {
  //   console.log("Connection Successful:", data);
  // },

  // onError: (error: any) => {
  //   console.log("Connection Failed:", error);
  // },
  // onSettled: (data: any, error: any) => {
  //   console.log("Connection attempt settled. Data:", data, "Error:", error);
  // },
  // onMutate: (data: any) => {
  //   console.log("Connection attempt settled.  Error:", data);
  // },
  //}
  const handleConnect = useCallback(
    async (connector: any) => {
      try {
        const { account, chain } = await connect(connector);
        console.log("Connected:", account ? account : "", chain);
      } catch (error) {
        console.error("Connection error:", error);
      }
    },
    [connect]
  );

  const supportedWallets = connectors.filter(
    (connector: any, index: any, arr: any) => {
      if (connector.name === "WalletConnect") {
        const walletConnectInstances = arr.filter(
          (w: any) => w.name === "WalletConnect"
        );
        return index === arr.indexOf(walletConnectInstances[1]);
      }
      return ["MetaMask", "Coinbase Wallet"].includes(connector.name);
    }
  );

  const sw = supportedWallets.slice(0, 3);
  const removeBeforeAt = (email: string) => {
    const atIndex = email.indexOf("@");
    return email.slice(0, atIndex);
  };

  const docCollectionRef = query(
    collection(db, "users"),
    where("address", "==", address || "")
  );
  const newUserRef = collection(db, "users");

  const docsQuery = useDocsQuery(
    ["users", isConnected, address],
    docCollectionRef
  );
  useEffect(() => {
    if (docsQuery.data?.docs && docsQuery?.data?.docs?.length >= 1) {
      //
      const docList = docsQuery?.data?.docs.map((doc: any) => ({
        ...doc.data(),
        userId: doc.id,
      }));
      console.log("docsQuery", docList[0]);
      setUserState({
        ...userState,
        user: docList[0],
      });
      //props.handleCreate();

      if (props.action === "createTrade") {
        props.handleCreate();
      } else {
        props.handleClose();
      }
    }
  }, [docsQuery.data?.docs]);

  const createFn = () => {
    if (props.action === "createTrade") {
      props.handleCreate();
    }
  };
  const userMutation = useSetDoc(newUserRef, createFn);

  useEffect(() => {
    if (isConnected) {
      // Handle connected state
      console.log("Wallet connected");
      toast.success(`Wallet connected`, { duration: 5000 });
      // console.log(docsQuery.data?.docs, "qu");
    } else {
      // Handle disconnected state
      console.log("Wallet disconnected");
    }
  }, [isConnected]);

  const handleRegister = (e: any) => {
    e.preventDefault();
    // register new user
    const userInfo = {
      name: removeBeforeAt(email),
      address: address,
      email: email,
    };
    userMutation.mutate(userInfo);
  };

  return (
    <>
      {/* chainId: {account.chainId} */}
      {/* <div>{error?.message}</div> */}
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
        className={style.modal}
        key="modal"
        variants={modalFunc}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {!isConnected ? (
          <div className={style.modalContent}>
            <div className={style.modalTop}>
              <p>Connect a wallet</p>
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
            <div className={style.modalBody}>
              <div className={style.connectors}>
                {sw.map((connector: any) => (
                  <div
                    className={`
                    ${style.connectBtn} 
                    ${!connector.ready || isLoading ? "disable2" : ""} 
                    `}
                    key={connector?.id}
                    onClick={() => handleConnect({ connector })}
                  >
                    <div className={style.walletImg} suppressHydrationWarning>
                      <Image
                        suppressHydrationWarning
                        src={
                          connector?.name === "MetaMask"
                            ? Metamask
                            : connector?.name === "WalletConnect"
                              ? Wc
                              : Coinbase
                        }
                        alt="wallet"
                      />
                    </div>
                    <p>
                      {connector.name}
                      {isLoading &&
                        pendingConnector?.id === connector.id &&
                        " (connecting)"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
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
            <div className={style.connBody}>
              {/* <p>Wallet succcessfully connected</p>
              <Image
                className={style.walletC}
                src={
                  activeConnector?.name === "MetaMask"
                    ? Metamask
                    : activeConnector?.name === "WalletConnect"
                      ? Wc
                      : Coinbase
                }
                alt="wallet"
              />
              <Image src={Success} alt="Success" />
              <Image src={Logo} alt="Tradebase" /> */}
              {!isRegistered ? (
                <form className={style.emailBody} onSubmit={handleRegister}>
                  <TextInput
                    labelName="Email address"
                    inputName="email"
                    type="email"
                    placeHolder="Enter email here"
                    ariaLabel="email"
                    inputHandler={(e) => setEmail(e.target.value)}
                  />
                  <p>Email is required to contact you in case of disputes.</p>
                  <button
                    type="submit"
                    disabled={email.length < 3 || userMutation?.isPending}
                  >
                    Proceed
                  </button>
                </form>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Connect;
