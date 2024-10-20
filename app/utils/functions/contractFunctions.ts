// "use client";
// import { ethers, providers } from "ethers";
// import { Web3Provider } from "@ethersproject/providers";
// import { useAccount } from "wagmi";
// import { useEffect, useState } from "react";
// import ABI from "../abi/escrow.json";

// //const { address } = useAccount();
// const contractAddress = "0xd6560c88Bb3A11d8555d11510482D5A06834990d";

// export const getEscrowAmount = async (transactionId: number | string) => {
//   const [contract, setContract] = useState<any>();

//   useEffect(() => {
//     const onCreateEscrow = async () => {
//       contract?.on(
//         "EscrowCreated",
//         (id: any, sender: any, seller: any, arbiter: any, amount: any) => {
//           console.log("emitting create escrow!");
//           console.log("values", id, sender, seller, arbiter, amount);
//         }
//       );
//     };
//     onCreateEscrow();

//     const onDeposit = async () => {
//       contract?.on("FundsDeposited", (id: any, sender: any, amount: any) => {
//         console.log("emitting deposit!");
//         console.log("values", id, sender, amount);
//         getEscrowAmount(id);
//       });
//     };
//     onDeposit();

//     const onTransactionComplete = async () => {
//       contract?.on("TransactionCompleted", (id: any, seller: any) => {
//         console.log("emitting transaction completed!");
//         console.log("values", id, seller);
//       });
//     };
//     onTransactionComplete();
//   }, [contract]);

//   const provider = new Web3Provider(window.ethereum);
//   const signer = provider.getSigner();
//   const contractObj = new ethers.Contract(contractAddress, ABI, signer);

//   //const depAmount = ethers.utils.parseEther("0.02");

//   try {
//     setContract(contractObj);
//     // Call the Solidity function
//     const amount: ethers.BigNumber =
//       await contract.getEscrowAmount(transactionId);

//     // Return the formatted escrow amount (assuming it's in wei)
//     return ethers.utils.formatEther(amount);
//   } catch (err) {
//     console.log(err);
//   }
// };
