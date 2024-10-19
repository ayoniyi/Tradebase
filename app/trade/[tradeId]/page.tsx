"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import style from "./TradePage.module.scss";
import Image from "next/image";

import Escrow from "../escrow.svg";
import Send from "../send.svg";
import Header from "@/app/components/header/Header";
import { useParams } from "next/navigation";
import {
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
import { shortenHex } from "@/app/utils/formatting";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SingleTrade = () => {
  const [status, setStatus] = useState("available");

  const [messageTxt, setMessageTxt] = useState<any>("");
  const [messages, setMessages] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<any>();
  const tradeId = useParams()?.tradeId;
  const [userState] = useContext<any>(UserContext);
  const queryClient = useQueryClient();
  const ref = useRef<null | HTMLDivElement>(null);

  const docRef = doc(db, `trades/${tradeId}`);
  const docsQuery = useDocQuery(["singleTrade", tradeId], docRef);
  const tradeInfo = docsQuery?.data?.data();
  //console.log(tradeInfo, "trade>>>");

  const { userId, address, email } = userState?.user;

  //update trade
  const tradeMutation = useUpdateDoc(docRef, () => {
    queryClient.invalidateQueries({ queryKey: ["singleTrade"] });
    toast.success("Transaction created!", {
      duration: 6500,
    });
  });
  //const transactionSucess = () => {};

  //create transaction
  const newTransactionRef = collection(db, "transactions");
  //const transactionMutation = useSetDoc(newTransactionRef, transactionSucess);
  const transactionMutation = useMutation({
    mutationFn: async (info: any) => addDoc(newTransactionRef, info),
    onError: (err: any) => {
      console.log("err", err);
      toast.error("Sorry, an error occured.", {
        duration: 6500,
      });
    },

    onSuccess: (res: any) => {
      console.log("app res", res?.id);
      const updateFields = {
        status: "transacting",
        pBuyer: address,
        transactionId: res?.id,
      };
      setTransactionId(res?.id);
      tradeMutation.mutate(updateFields);
      //console.log("tr", tradeMutation?.data();
    },
  });

  const createTransaction = () => {
    const transactionObj = {
      tradeId: tradeId,
      buyerAddress: address,
      buyerEmail: email,
      buyerId: userId,
      messages: [],
      sellerAddress: tradeInfo?.sellerAddress,
      sellerEmail: tradeInfo?.sellerEmail,
      sellerId: tradeInfo?.sellerId,
      status: "transacting",
    };
    transactionMutation.mutate(transactionObj);
    console.log("transaction mutation", transactionMutation);
  };

  //make payment

  const currentTransactionId = transactionId || tradeInfo?.transactionId;

  // useEffect(() => {
  //   if (currentTransactionId) {
  //     const unSub = onSnapshot(
  //       doc(db, "transactions", currentTransactionId),
  //       (doc) => {
  //         doc.exists() && setMessages(doc.data().messages);
  //       }
  //     );

  //     return () => {
  //       unSub();
  //     };
  //   }
  // }, [currentTransactionId]);
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
                toast.success("New message from ongoing transaction", {
                  duration: 2500,
                });
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
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={style.container}>
        <h2>Trade #{tradeId.slice(-4)}</h2>
        {tradeInfo?.status !== "available" && (
          <h3>
            Transaction between {shortenHex(tradeInfo?.sellerAddress)} and{" "}
            {shortenHex(tradeInfo?.pBuyer)}
            Add
          </h3>
        )}

        {tradeInfo?.status === "available" ? (
          <div className={style.cardBorder}>
            <div className={style.tradeBox}>
              <div className={style.tradeCreated}>
                <div className={style.tradeDesc}>
                  <div className={style.tradeStatus}>
                    <Image src={Escrow} alt="trade created" />
                    <p>Buy Token</p>
                  </div>
                  <p className={style.tradeTitle}>
                    <span>
                      {tradeInfo?.amountOfToken +
                        " " +
                        tradeInfo?.tokenToBeSold}
                    </span>{" "}
                    for sale @ <span>{tradeInfo?.price} ETH</span>{" "}
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
                    <p>{tradeInfo?.tokenToBeSold}</p>
                  </div>
                  <div className={style.breakRow}>
                    <p>Token quantity for sale</p>
                    <p>{parseFloat(tradeInfo?.amountOfToken).toFixed(2)}</p>
                  </div>
                  <div className={style.breakRow}>
                    <p>Price</p>
                    <p>{parseFloat(tradeInfo?.price).toFixed(2)} ETH</p>
                  </div>
                </div>
                <div className={style.shareBtns}>
                  <button
                    //onClick={createEscrow}
                    onClick={createTransaction}
                    className={style.shareBtn}
                    disabled={
                      tradeMutation.isPending || transactionMutation.isPending
                    }
                  >
                    {tradeMutation.isPending ||
                    transactionMutation.isPending ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      "Create transaction"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={style.tradeBoxes}>
            <div className={style.tradeCol}>
              <div className={style.balanceBox}>
                <h3>0.5 ETH</h3>
                <h4>Transaction Balance</h4>
                <p>
                  This is the amount currently being held in escrow until buyer
                  decides to release to the seller.
                </p>
              </div>
              <div className={style.tradeBoxActive}>
                <div className={style.tradeCreated}>
                  <div className={style.tradeDesc}>
                    <div className={style.tradeStatus}>
                      <Image src={Escrow} alt="trade created" />
                      <p>Make Payment</p>
                    </div>
                    <p className={style.tradeTitle}>
                      <span>
                        {tradeInfo?.amountOfToken +
                          " " +
                          tradeInfo?.tokenToBeSold}
                      </span>{" "}
                      for sale @ <span>{tradeInfo?.price} ETH</span>{" "}
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
                      <p>{tradeInfo?.tokenToBeSold}</p>
                    </div>
                    <div className={style.breakRow}>
                      <p>Token quantity for sale</p>
                      <p>{parseFloat(tradeInfo?.amountOfToken).toFixed(2)}</p>
                    </div>
                    <div className={style.breakRow}>
                      <p>Price</p>
                      <p>{parseFloat(tradeInfo?.price).toFixed(2)} ETH</p>
                    </div>
                  </div>
                  <div className={style.shareBtns}>
                    <button
                      //onClick={createEscrow}
                      className={style.shareBtn}
                    >
                      Make payment
                    </button>
                    <button
                      //onClick={createEscrow}
                      className={style.backBtn}
                    >
                      Close transaction
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.tradeCol}>
              <div className={style.chatBox}>
                {/* <div className={style.dotBx}>
                  <Image src={Dots} alt="options" />
                </div> */}

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
                    onChange={(e: any) => setMessageTxt(e.target.value)}
                    value={messageTxt}
                    required
                  />

                  <button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      <Image src={Send} alt="send" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleTrade;
