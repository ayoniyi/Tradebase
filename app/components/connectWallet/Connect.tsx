"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import style from "./Connect.module.scss";
import { log } from "console";
const Connect = (props: any) => {
  const account = useAccount();
  const { connectors, connect, status, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  //console.log("conn", connectors);
  const supportedWallets = connectors.slice(0, 3);
  //console.log(supportedWallets, "supportedWallets");

  return (
    <>
      {/* addresses: {JSON.stringify(account.addresses)} */}
      {/* chainId: {account.chainId} */}
      {/* {account.status === "connected" && (
            <button type="button" onClick={() => disconnect()}>
              Disconnect
            </button>
          )} */}
      {/* {supportedWallets.map((connector: any) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))} */}
      {/* <div>{status}</div>
         <div>{error?.message}</div> */}
      <div className={style.overlay}></div>

      <div className={style.modal}>
        <div className={style.modalContent}>
          <div className={style.modalTop}>
            <p>Connect wallet</p>
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
            <p>Connect a wallet</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Connect;
