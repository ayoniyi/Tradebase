"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./Trade.module.scss";
import Image from "next/image";

import Seller from "./seller.svg";
import Escrow from "../escrow.svg";
import Send from "../send.svg";
import Header from "@/app/components/header/Header";
import { useParams, useRouter } from "next/navigation";
import {
  addNotification,
  useDocQuery,
  useUpdateDoc,
} from "@/app/utils/functions/firebaseFunctions";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/utils/firebase";
import { UserContext } from "@/app/context/UserContext";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { shortenAddress, shortenHex } from "@/app/utils/formatting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConnect } from "wagmi";
import { baseSepolia } from "viem/chains";
import { injected } from "wagmi/connectors";
import { BigNumber, ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import ABI from "../../utils/abi/escrow.json";
import CardSkeleton from "@/app/components/Skeleton/CardSkeleton";
import { useAccount } from "wagmi";
import Link from "next/link";
import TradeBoxes from "./TradeBoxes";
const SingleTrade = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [contract, setContract] = useState<any>();
  const [balance, setBalance] = useState<any>(0);
  const { address } = useAccount();

  const { connectAsync } = useConnect();

  const [messageTxt, setMessageTxt] = useState<any>("");
  const [messages, setMessages] = useState<any>();
  const [triggering, setTriggering] = useState(false);
  const [transactionId, setTransactionId] = useState<any>();
  const tradeId = useParams()?.tradeId;
  const [escrowId, setEscrowId] = useState<any>();
  const [userState] = useContext<any>(UserContext);

  const router = useRouter();
  const queryClient = useQueryClient();
  const ref = useRef<null | HTMLDivElement>(null);

  const docRef = doc(db, `trades/${tradeId}`);
  const docsQuery = useDocQuery(["singleTrade", tradeId], docRef, 10000);
  const tradeInfo: any = docsQuery?.data?.data();

  //console.log("tradeInfo", tradeInfo);

  //update trade
  const tradeMutation = useUpdateDoc(docRef, () => {
    queryClient.invalidateQueries({ queryKey: ["singleTrade"] });
    toast.success("Trade updated", {
      duration: 3500,
    });
  });
  //let window: any;
  const emitMutation = useUpdateDoc(docRef, () => {
    queryClient.invalidateQueries({ queryKey: ["singleTrade"] });
    // toast.success("Trade updated", {
    //   duration: 3500,
    // });
  });
  //let window: any;
  const contractAddress = "0xd6560c88Bb3A11d8555d11510482D5A06834990d";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  //const provider = new Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractObj = new ethers.Contract(contractAddress, ABI, signer);

  const currentTransactionId = transactionId || tradeInfo?.transactionId;

  const transactionMutation = useMutation({
    mutationFn: async (info: any) => addDoc(newTransactionRef, info),
    onError: (err: any) => {
      console.log("err", err);
      toast.error("Sorry, an error occured.", {
        duration: 6500,
      });
    },

    onSuccess: (res: any) => {
      //  console.log("app res", res?.id);
      const updateFields = {
        status: "awaiting payment",
        pBuyer: userState?.user?.address,
        transactionId: res?.id,
        escrowId: escrowId,
      };
      setTransactionId(res?.id);
      tradeMutation.mutate(updateFields);
      //console.log("tr", tradeMutation?.data();
    },
  });
  const createTransaction = (escId: any) => {
    const { userId, myAddress, email } = userState?.user;
    const transactionObj = {
      tradeId: tradeId,
      escrowId: escId,
      buyerAddress: myAddress || address,
      buyerEmail: email,
      buyerId: userId,
      messages: [],
      sellerAddress: tradeInfo?.sellerAddress,
      sellerEmail: tradeInfo?.sellerEmail,
      sellerId: tradeInfo?.sellerId,
      status: "transacting",
    };
    transactionMutation.mutate(transactionObj);
  };
  useEffect(() => {
    const onCreateEscrow = async () => {
      contract?.on(
        "EscrowCreated",
        (id: any, sender: any, seller: any, arbiter: any, amount: any) => {
          console.log("emitting create escrow!");
          console.log("values", id, sender, seller, arbiter, amount);
          //console.log("id", id?._hex.slice(-1));
          const hexConvert = BigNumber.from(id?._hex);
          console.log("hex", hexConvert.toString());

          setEscrowId(hexConvert.toString());
          const eId = hexConvert.toString();
          // start the countdown
          createTransaction(eId);
        }
      );
    };
    onCreateEscrow();

    const onDeposit = async () => {
      contract?.on("FundsDeposited", (id: any, sender: any, amount: any) => {
        console.log("emitting deposit!");
        console.log("values", id, sender, amount);
        const hexConvert = BigNumber.from(amount?._hex);
        const formatAmt = hexConvert.toString();
        console.log("amount", ethers.utils.formatEther(formatAmt));
        setBalance(ethers.utils.formatEther(formatAmt));

        //update trade balance
        const updateFields = {
          tradeBalance: ethers.utils.formatEther(formatAmt),
        };
        emitMutation.mutate(updateFields);
      });
    };
    onDeposit();

    const onTransactionComplete = async () => {
      contract?.on("TransactionCompleted", (id: any, seller: any) => {
        console.log("emitting transaction completed!");
        console.log("values", id, seller);

        setBalance(0);
        //update trade balance
        const updateFields = {
          tradeBalance: 0,
        };
        emitMutation.mutate(updateFields);
      });
    };
    onTransactionComplete();
  }, [contract]);

  const currentEscrowId = escrowId || tradeInfo?.escrowId;
  useEffect(() => {
    const getBalance = async () => {
      // Call the Solidity function
      const amount = await contractObj.getEscrowAmount(currentEscrowId);
      const formatAmt = amount.toString();
      console.log("amount", ethers.utils.formatEther(formatAmt));
    };
    if (currentEscrowId) {
      getBalance();
    }
  }, [currentEscrowId]);

  //create transaction

  // create countdown of 10 minutes, on countdown completion update trade status back to available
  const newTransactionRef = collection(db, "transactions");

  const addressContext = address || userState?.address;

  const createEscrow = async () => {
    if (addressContext && tradeInfo) {
      setIsLoading(true);
      // show info
      console.log("seller>", tradeInfo?.sellerAddress.toString());
      console.log("arbiter>", process.env.NEXT_PUBLIC_ARBITER);

      // seller address //arbiter address //amount
      try {
        const itemAmount = ethers.utils.parseEther(tradeInfo?.price.toString());
        //const provider = new providers.Web3Provider(window.ethereum);
        setContract(contractObj);
        const call = await contractObj.createEscrow(
          tradeInfo?.sellerAddress.toString(), // seller
          process.env.NEXT_PUBLIC_ARBITER, // arbiter
          itemAmount,
          {
            gasLimit: 5000000,
          }
        );
        await call.wait();
        //console.log("create ecr>>", call);
        setIsLoading(false);
      } catch (err: any) {
        console.log("err", err);
        setIsLoading(false);
      }
    } else {
      //connect wallet
      await connectAsync({ chainId: baseSepolia.id, connector: injected() });
    }
  };
  //

  //make payment
  const payMutation = useUpdateDoc(docRef, () => {
    queryClient.invalidateQueries({ queryKey: ["singleTrade"] });
    toast.success("Payment successful", {
      duration: 5500,
    });
  });
  const makePayment = async () => {
    if (addressContext && tradeInfo) {
      setIsLoading(true);

      try {
        const itemAmount = ethers.utils.parseEther(tradeInfo?.price.toString());

        setContract(contractObj);
        const call = await contractObj.depositFunds(currentEscrowId, {
          value: itemAmount,
          gasLimit: 5000000,
        });
        await call.wait();
        // stop the countdown
        payMutation.mutate({ status: "awaiting item" });
      } catch (err: any) {
        console.log("err", err);
        //setIsLoading(false);
      }
      // setIsLoading(false);
    } else {
      //connect wallet
      await connectAsync({ chainId: baseSepolia.id, connector: injected() });
    }
  };

  // tokens sent
  const sentMutation = useUpdateDoc(docRef, () => {
    queryClient.invalidateQueries({ queryKey: ["singleTrade"] });
    toast.success("Status updated", {
      duration: 5500,
    });
  });
  const tokensSent = () => {
    sentMutation.mutate({ status: "awaiting release" });
  };

  // release funds
  const releaseMutation = useUpdateDoc(docRef, () => {
    queryClient.invalidateQueries({ queryKey: ["singleTrade"] });
    toast.success("Funds released", {
      duration: 5500,
    });
  });
  const releaseFunds = async () => {
    if (addressContext && tradeInfo) {
      //setIsLoading(true);
      const releaseToast = toast.loading("Releasing funds...");
      try {
        setContract(contractObj);
        const call = await contractObj.completeTransaction(currentEscrowId, {
          gasLimit: 5000000,
        });
        await call.wait();
        setBalance(0);
        releaseMutation.mutate({ status: "complete" });
        //console.log("create ecr>>", call);
        //setIsLoading(false);

        toast.dismiss(releaseToast);
      } catch (err: any) {
        console.log("err", err);
        //setIsLoading(false);
        toast.dismiss(releaseToast);
      }
    } else {
      //connect wallet
      await connectAsync({ chainId: baseSepolia.id, connector: injected() });
    }
  };

  const previousMessagesRef = useRef([]);

  useEffect(() => {
    let soundBite = new Audio("/bite.mp3");
    if (currentTransactionId) {
      const unSub = onSnapshot(
        doc(db, "transactions", currentTransactionId),
        (doc) => {
          if (doc.exists()) {
            const newMessages = doc.data().messages;
            setMessages(newMessages);

            // Check if there are new messages and if the sender is not the current user
            if (newMessages.length > previousMessagesRef.current.length) {
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage.senderId !== userState?.user?.userId) {
                //console.log("new message!");

                soundBite.play();
                // Add a new notification
                addNotification(
                  userState?.user?.userId,
                  {
                    title: "New message",
                    message:
                      "You have a new message from " + lastMessage.senderEmail,
                    timestamp: new Date(),
                    read: false,
                  },
                  db
                );
              }
            }

            // Update the ref with the current messages
            previousMessagesRef.current = newMessages;
          }
        }
      );

      return () => {
        unSub();
      };
    }
  }, [currentTransactionId, userState?.user?.userId]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //send message
  const handleSend = async (e: any) => {
    const { userId, address, email } = userState?.user;
    //setIsLoading(true);
    e.preventDefault();
    try {
      await updateDoc(doc(db, "transactions", currentTransactionId), {
        messages: arrayUnion({
          mId: Math.floor(Math.random() * 1000000),
          text: messageTxt,
          senderId: userId,
          senderEmail: email,
          date: Timestamp.now(),
        }),
      });

      setMessageTxt("");
      //setIsLoading(false);
    } catch (err) {
      console.log(err);
      //setIsLoading(false);
    }
  };

  const handleMsgTxt = (e: any) => {
    setMessageTxt(e);
  };

  return (
    <>
      <Header currentPage="Marketplace" />

      <div className={style.container}>
        {docsQuery.isPending ? (
          <CardSkeleton />
        ) : (
          <>
            {tradeInfo?.tradeOption === "Token swap" ? (
              <>
                {tradeInfo?.status === "available" ? (
                  <div className={style.content}>
                    <div className={style.top}>
                      <Link href="/marketplace">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L6.29289 7.29289C6.68342 6.90237 7.31658 6.90237 7.70711 7.29289C8.09763 7.68342 8.09763 8.31658 7.70711 8.70711L5.41421 11L21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13L5.41421 13L7.70711 15.2929C8.09763 15.6834 8.09763 16.3166 7.70711 16.7071C7.31658 17.0976 6.68342 17.0976 6.29289 16.7071L2.29289 12.7071Z"
                            fill="black"
                          />
                        </svg>
                      </Link>

                      <h2>{tradeInfo?.tradeOption}</h2>
                    </div>
                    <div className={style.sellerBox}>
                      <Image src={Seller} alt="seller" />
                      <p>Seller {shortenHex(tradeInfo?.sellerAddress)}</p>
                    </div>

                    <div className={style.tradeTxt}>
                      <p className={style.introTxt}>
                        <span>
                          {tradeInfo?.amountOfToken +
                            " " +
                            tradeInfo?.tokenToBeSold}
                        </span>{" "}
                        for sale @ <span>{tradeInfo?.price} ETH</span>{" "}
                      </p>
                      <p className={style.tradeDesc}>
                        Funds will be held in a latent wallet until you confirm
                        receipt of tokens, the funds would be realeased to the
                        seller thereafter.
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
                    {tradeInfo?.sellerAddress !== userState?.user?.address ? (
                      <div className={style.trBtns}>
                        <button
                          className={style.cancelBtn}
                          onClick={() => router.back()}
                        >
                          Cancel
                        </button>

                        <button
                          onClick={createEscrow}
                          className={style.enterBtn}
                          disabled={
                            tradeMutation.isPending ||
                            transactionMutation.isPending ||
                            isLoading
                          }
                        >
                          {tradeMutation.isPending ||
                          transactionMutation.isPending ||
                          isLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : (
                            "Confirm and enter trade"
                          )}
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <TradeBoxes
                    tradeInfo={tradeInfo}
                    userState={userState}
                    balance={balance}
                    messages={messages}
                    messageTxt={messageTxt}
                    handleMsgTxt={handleMsgTxt}
                    ref={ref}
                    isLoading={isLoading}
                    handleSend={handleSend}
                    makePayment={makePayment}
                    payMutation={payMutation}
                    releaseFunds={releaseFunds}
                    releaseMutation={releaseMutation}
                    tokensSent={tokensSent}
                    sentMutation={sentMutation}
                  />
                )}
              </>
            ) : (
              <div className={style.content}>
                <div className={style.top}>
                  <Link href="/marketplace">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L6.29289 7.29289C6.68342 6.90237 7.31658 6.90237 7.70711 7.29289C8.09763 7.68342 8.09763 8.31658 7.70711 8.70711L5.41421 11L21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13L5.41421 13L7.70711 15.2929C8.09763 15.6834 8.09763 16.3166 7.70711 16.7071C7.31658 17.0976 6.68342 17.0976 6.29289 16.7071L2.29289 12.7071Z"
                        fill="black"
                      />
                    </svg>
                  </Link>

                  <h2>{tradeInfo?.tradeOption}</h2>
                </div>
                <div className={style.sellerBox}>
                  <Image src={Seller} alt="seller" />
                  <p>Seller {shortenHex(tradeInfo?.sellerAddress)}</p>
                </div>

                <div className={style.tradeTxt}>
                  <p className={style.introTxt}>
                    <span>{tradeInfo?.productName}</span> for sale @{" "}
                    <span>{tradeInfo?.price} ETH</span>{" "}
                  </p>
                  <p className={style.tradeDesc}>
                    Funds will be held in a latent wallet until you confirm
                    receipt of product(s), the funds would be realeased to the
                    seller thereafter.
                  </p>
                </div>
                <div className={style.tradeBreakdown}>
                  <div className={style.breakRow}>
                    <p>Product for sale</p>
                    <p>{tradeInfo?.productName}</p>
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
                <div className={style.trBtns}>
                  <button
                    className={style.cancelBtn}
                    onClick={() => router.back()}
                  >
                    Cancel
                  </button>

                  <button className={style.enterBtn}>
                    Confirm and enter trade
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SingleTrade;
