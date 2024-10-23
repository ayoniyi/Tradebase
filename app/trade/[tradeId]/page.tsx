"use client";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import style from "./TradePage.module.scss";
import Image from "next/image";

import Escrow from "../escrow.svg";
import Send from "../send.svg";
import Header from "@/app/components/header/Header";
import { useParams } from "next/navigation";
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
import { shortenHex } from "@/app/utils/formatting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConnect } from "wagmi";
import { baseSepolia } from "viem/chains";
import { injected } from "wagmi/connectors";
import { BigNumber, ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import ABI from "../../utils/abi/escrow.json";
import CardSkeleton from "@/app/components/Skeleton/CardSkeleton";
import { useAccount } from "wagmi";
import ItemBox from "./ItemBox";

const SingleTrade = () => {
  const [contract, setContract] = useState<any>();
  const [balance, setBalance] = useState<any>(0);
  const { address } = useAccount();

  const { connectAsync } = useConnect();

  const [messageTxt, setMessageTxt] = useState<any>("");
  const [messages, setMessages] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<any>();
  const tradeId = useParams()?.tradeId;
  const [escrowId, setEscrowId] = useState<any>();
  const [userState] = useContext<any>(UserContext);

  const queryClient = useQueryClient();
  const ref = useRef<null | HTMLDivElement>(null);

  const docRef = doc(db, `trades/${tradeId}`);
  const docsQuery = useDocQuery(["singleTrade", tradeId], docRef, 10000);
  const tradeInfo = docsQuery?.data?.data();

  //update trade
  const tradeMutation = useUpdateDoc(docRef, () => {
    queryClient.invalidateQueries({ queryKey: ["singleTrade"] });
    toast.success("Trade updated", {
      duration: 3500,
    });
  });

  const contractAddress = "0xd6560c88Bb3A11d8555d11510482D5A06834990d";
  const provider = new Web3Provider(window.ethereum);
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
        tradeMutation.mutate(updateFields);
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
        tradeMutation.mutate(updateFields);
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
      //await connectAsync({ chainId: baseSepolia.id, connector: injected() });
    }
  };

  //console.log("transaction mutation", transactionMutation);

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
      setIsLoading(true);

      try {
        setContract(contractObj);

        const call = await contractObj.completeTransaction(currentEscrowId, {
          gasLimit: 5000000,
        });
        await call.wait();
        setBalance(0);
        releaseMutation.mutate({ status: "complete" });
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
      {docsQuery.isPending ? (
        <div className={style.container}>
          <CardSkeleton />
        </div>
      ) : (
        <div className={style.container}>
          <h2>Trade #{tradeId.slice(-4)}</h2>
          {tradeInfo?.status !== "available" && (
            <h3>
              Transaction between {shortenHex(tradeInfo?.sellerAddress)} and{" "}
              {shortenHex(tradeInfo?.pBuyer)}
              Add
            </h3>
          )}
          {tradeInfo?.tradeOption === "Token swap" ? (
            <>
              {tradeInfo?.status === "available" ? (
                <div className={style.cardBorder}>
                  <div className={style.tradeBox}>
                    <div className={style.tradeCreated}>
                      <div className={style.tradeDesc}>
                        <div className={style.tradeStatus}>
                          <Image src={Escrow} alt="trade created" />
                          <p>
                            {" "}
                            {tradeInfo?.sellerAddress !==
                            userState?.user?.address
                              ? "Buy Token"
                              : "Token sale"}
                          </p>
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
                          {tradeInfo?.sellerAddress !==
                          userState?.user?.address ? (
                            <p>
                              Funds will be held in a latent wallet until you
                              confirm receipt of tokens, the funds would be
                              realeased to the seller thereafter.
                            </p>
                          ) : (
                            <p>
                              Funds will be held in a latent wallet until buyer
                              confirms receipt of tokens, the funds would be
                              realeased to you thereafter.
                            </p>
                          )}
                        </div>
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
                      </div>
                      <div className={style.shareBtns}>
                        {tradeInfo?.sellerAddress !==
                        userState?.user?.address ? (
                          <button
                            onClick={createEscrow}
                            className={style.shareBtn}
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
                              "Create transaction"
                            )}
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={style.tradeBoxes}>
                  <div className={style.tradeCol}>
                    <div className={style.balanceBox}>
                      <h3>
                        {tradeInfo?.tradeBalance !== 0
                          ? tradeInfo?.tradeBalance
                          : balance}{" "}
                        ETH
                      </h3>
                      <h4>Transaction Balance</h4>
                      <p>
                        This is the amount currently being held in escrow until
                        buyer decides to release to the seller.
                      </p>
                    </div>
                    <div className={style.tradeBoxActive}>
                      {tradeInfo?.sellerAddress === userState?.user?.address ? (
                        <div className={style.tradeCreated}>
                          <div className={style.tradeCreated}>
                            <div className={style.tradeDesc}>
                              <div className={style.tradeStatus}>
                                <Image src={Escrow} alt="trade created" />
                                <p>Token Sale</p>
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
                                  Funds will be held in a latent wallet until
                                  buyer confirms receipt of tokens, the funds
                                  would be realeased to the you thereafter.
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
                                <p>{tradeInfo?.amountOfToken.toString()}</p>
                              </div>
                              <div className={style.breakRow}>
                                <p>Price</p>
                                <p>{tradeInfo?.price.toString()} ETH</p>
                              </div>
                            </div>
                            <div className={style.shareBtns}>
                              {tradeInfo?.status === "awaiting item" ? (
                                <>
                                  <p
                                    style={{
                                      fontSize: "13px",
                                      color: "gray",
                                    }}
                                  >
                                    Click here when you send the tokens
                                  </p>
                                  <button
                                    onClick={tokensSent}
                                    className={style.shareBtn}
                                    disabled={
                                      tradeInfo?.status !== "awaiting item" ||
                                      sentMutation.isPending
                                    }
                                  >
                                    Tokens sent
                                  </button>
                                </>
                              ) : tradeInfo?.status === "awaiting release" ? (
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Awaiting release of funds...
                                </p>
                              ) : (
                                ""
                              )}
                              {tradeInfo?.status !== "complete" ? (
                                <button
                                  //onClick={createEscrow}
                                  className={style.backBtn}
                                >
                                  Open dispute
                                </button>
                              ) : (
                                <button disabled className={style.shareBtn}>
                                  Transaction complete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
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
                                Funds will be held in a latent wallet until you
                                confirm receipt of tokens, the funds would be
                                realeased to the seller thereafter.
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
                              <p>{tradeInfo?.amountOfToken.toString()}</p>
                            </div>
                            <div className={style.breakRow}>
                              <p>Price</p>
                              <p>{tradeInfo?.price.toString()} ETH</p>
                            </div>
                          </div>
                          <div className={style.shareBtns}>
                            {tradeInfo?.status === "awaiting payment" ? (
                              <button
                                onClick={makePayment}
                                disabled={payMutation.isPending || isLoading}
                                className={style.shareBtn}
                              >
                                Make payment
                              </button>
                            ) : tradeInfo?.status === "awaiting item" ? (
                              <p
                                style={{
                                  fontSize: "14px",
                                  fontStyle: "italic",
                                }}
                              >
                                Awaiting receipt of items...
                              </p>
                            ) : tradeInfo?.status === "awaiting release" ? (
                              <>
                                <p
                                  style={{
                                    fontSize: "13px",
                                    color: "gray",
                                  }}
                                >
                                  Click this only when you receive what you paid
                                  for
                                </p>
                                <button
                                  onClick={releaseFunds}
                                  className={style.shareBtn}
                                  disabled={
                                    releaseMutation.isPending || isLoading
                                  }
                                >
                                  Release funds
                                </button>
                              </>
                            ) : (
                              ""
                            )}

                            {tradeInfo?.status !== "complete" ? (
                              <button
                                //onClick={createEscrow}
                                className={style.backBtn}
                              >
                                Open dispute
                              </button>
                            ) : (
                              <button disabled className={style.shareBtn}>
                                Transaction complete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={style.tradeCol}>
                    <div className={style.chatBox}>
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
            </>
          ) : (
            <>
              {tradeInfo?.status === "available" ? (
                <div className={style.cardBorder}>
                  <div className={style.tradeBox}>
                    <div className={style.tradeCreated}>
                      <div className={style.trImg}>
                        <Image
                          src={tradeInfo?.productImage}
                          width={130}
                          height={130}
                          alt={tradeInfo?.productImage}
                        />
                        <p>{tradeInfo?.productName}</p>
                      </div>
                      <div className={style.tradeDesc}>
                        <div className={style.tradeStatus}>
                          <Image src={Escrow} alt="trade created" />
                          <p>
                            {" "}
                            {tradeInfo?.sellerAddress !==
                            userState?.user?.address
                              ? "Buy Product"
                              : "Product sale"}
                          </p>
                        </div>
                        <p className={style.tradeTitle}>
                          <span>{tradeInfo?.productName}</span> for sale @{" "}
                          <span>{tradeInfo?.price} ETH</span>{" "}
                        </p>
                        <div className={style.tradeTxt}>
                          <p>
                            Funds will be held in a latent wallet until buyer
                            confirms receipt of product(s), the funds would be
                            realeased to the seller thereafter.
                          </p>
                        </div>
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
                      </div>
                      <div className={style.shareBtns}>
                        {tradeInfo?.sellerAddress !==
                        userState?.user?.address ? (
                          <button
                            onClick={createEscrow}
                            className={style.shareBtn}
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
                              "Create transaction"
                            )}
                          </button>
                        ) : (
                          ""
                        )}
                        {/* <button className={style.viewBtn}>Cancel</button> */}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={style.tradeBoxes}>
                  <div className={style.tradeCol}>
                    <div className={style.balanceBox}>
                      <h3>
                        {tradeInfo?.tradeBalance !== 0
                          ? tradeInfo?.tradeBalance
                          : balance}{" "}
                        ETH
                      </h3>
                      <h4>Transaction Balance</h4>
                      <p>
                        This is the amount currently being held in escrow until
                        buyer decides to release to the seller.
                      </p>
                    </div>
                    <div className={style.tradeBoxActive}>
                      {tradeInfo?.sellerAddress === userState?.user?.address ? (
                        <div className={style.tradeCreated}>
                          <div className={style.tradeCreated}>
                            <div className={style.tradeDesc}>
                              <div className={style.tradeStatus}>
                                <Image src={Escrow} alt="trade created" />
                                <p>Item Sale</p>
                              </div>
                              <p className={style.tradeTitle}>
                                <span>{tradeInfo?.productName}</span> for sale @{" "}
                                <span>{tradeInfo?.price} ETH</span>{" "}
                              </p>
                              <div className={style.tradeTxt}>
                                <p>
                                  Funds will be held in a latent wallet until
                                  buyer confirms receipt of product(s), the
                                  funds would be realeased to the seller
                                  thereafter.
                                </p>
                              </div>
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
                            </div>
                            <div className={style.shareBtns}>
                              {tradeInfo?.status === "awaiting item" ? (
                                <>
                                  <p
                                    style={{
                                      fontSize: "13px",
                                      color: "gray",
                                    }}
                                  >
                                    Click here when you send the tokens
                                  </p>
                                  <button
                                    onClick={tokensSent}
                                    className={style.shareBtn}
                                    disabled={
                                      tradeInfo?.status !== "awaiting item" ||
                                      sentMutation.isPending
                                    }
                                  >
                                    Items sent
                                  </button>
                                </>
                              ) : tradeInfo?.status === "awaiting release" ? (
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Awaiting release of funds...
                                </p>
                              ) : (
                                ""
                              )}
                              {tradeInfo?.status !== "complete" ? (
                                <button
                                  //onClick={createEscrow}
                                  className={style.backBtn}
                                >
                                  Open dispute
                                </button>
                              ) : (
                                <button disabled className={style.shareBtn}>
                                  Transaction complete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={style.tradeCreated}>
                          <div className={style.tradeDesc}>
                            <div className={style.tradeStatus}>
                              <Image src={Escrow} alt="trade created" />
                              <p>Buy Token</p>
                            </div>
                            <p className={style.tradeTitle}>
                              <span>{tradeInfo?.productName}</span> for sale @{" "}
                              <span>{tradeInfo?.price} ETH</span>{" "}
                            </p>
                            <div className={style.tradeTxt}>
                              <p>
                                Funds will be held in a latent wallet until
                                buyer confirms receipt of product(s), the funds
                                would be realeased to the seller thereafter.
                              </p>
                            </div>
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
                          </div>
                          <div className={style.shareBtns}>
                            {tradeInfo?.status === "awaiting payment" ? (
                              <button
                                onClick={makePayment}
                                disabled={payMutation.isPending || isLoading}
                                className={style.shareBtn}
                              >
                                Make payment
                              </button>
                            ) : tradeInfo?.status === "awaiting item" ? (
                              <p
                                style={{
                                  fontSize: "14px",
                                  fontStyle: "italic",
                                }}
                              >
                                Awaiting receipt of items...
                              </p>
                            ) : tradeInfo?.status === "awaiting release" ? (
                              <>
                                <p
                                  style={{
                                    fontSize: "13px",
                                    color: "gray",
                                  }}
                                >
                                  Click this only when you receive what you paid
                                  for
                                </p>
                                <button
                                  onClick={releaseFunds}
                                  className={style.shareBtn}
                                  disabled={
                                    releaseMutation.isPending || isLoading
                                  }
                                >
                                  Release funds
                                </button>
                              </>
                            ) : (
                              ""
                            )}

                            {tradeInfo?.status !== "complete" ? (
                              <button
                                //onClick={createEscrow}
                                className={style.backBtn}
                              >
                                Open dispute
                              </button>
                            ) : (
                              <button disabled className={style.shareBtn}>
                                Transaction complete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={style.tradeCol}>
                    <div className={style.chatBox}>
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
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SingleTrade;
