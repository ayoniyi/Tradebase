import React, { useContext, useEffect, useState } from "react";
import style from "./Header.module.scss";
import Image from "next/image";
import Logo from "@/app/logo.svg";
import Link from "next/link";

import HeaderMobile from "./HeaderMobile";
import { useAccount, useDisconnect, useSwitchChain, useChainId } from "wagmi";
import { shortenHex } from "@/app/utils/formatting";
import { AnimatePresence } from "framer-motion";
import Connect from "../connectWallet/Connect";
import toast from "react-hot-toast";
import Create from "../createTrade/Create";
import { UserContext } from "@/app/context/UserContext";
//import { ConnectButton } from "@rainbow-me/rainbowkit";

import HomeIcon from "./home.svg";
import MarketIcon from "./clock.svg";
import DashboardIcon from "./dashboard.svg";

// import { watchChainId } from '@wagmi/core'
// import { getConfig} from '../../utils/wagmi'

interface HeaderProps {
  currentPage: string;
}

const Header = ({ currentPage }: HeaderProps) => {
  const { address, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  const [showDisconnect, setShowDisconnect] = useState(false);
  const { disconnect } = useDisconnect();
  const [showConnect, setShowConnect] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [userState, setUserState] = useContext<any>(UserContext);
  const [isSupported, setIsSupported] = useState(false);

  const addressContext = address || userState?.address;
  //console.log("addressContext --", addressContext);

  const acceptedChains = ["84532"];
  const chainId = useChainId();

  useEffect(() => {
    if (acceptedChains.includes(chainId.toString())) {
      //setIsSupported(true);
      setUserState({
        ...userState,
        supportedChain: true,
      });
    }
    // } else {
    //   setIsSupported(false);
    // }
  }, [chainId]);

  // console.log("isSupported", isSupported);
  // console.log("chainId", chainId);
  // console.log(useChainId());

  const handleConnect = () => {
    if (addressContext) {
      disconnect();
      setUserState({
        ...userState,
        user: null,
        address: null,
      });
      window.localStorage.removeItem("userContext");
      window.localStorage.removeItem("addContext");
      toast.success("Wallet disconnected");
    } else {
      //connect wallet
      setShowConnect(true);
    }
  };

  const handleSwitch = (id: any) => {
    switchChain({ chainId: id });
  };

  // const handleCreate = () => {
  //   setShowCreate(true);
  // };
  const handleModals = () => {
    if (isConnected) {
      setShowConnect(false);
      setShowCreate(true);
    } else {
      setShowCreate(false);
      setShowConnect(true);
    }
    //setShowConnect(true);
  };

  const handleClose = () => {
    setShowConnect(false);
    setShowCreate(false);
  };

  const links = [
    {
      name: "Home",
      link: "/",
      icon: HomeIcon,
    },
    {
      name: "Marketplace",
      link: "/marketplace",
      icon: MarketIcon,
    },
    {
      name: "My trades",
      link: "/myTrades",
      icon: DashboardIcon,
    },
  ];

  const filteredLinks = links.filter((link) => {
    // Only include 'Dashboard' if authenticated, otherwise include 'Home'
    if (link.name === "Home")
      return !addressContext || addressContext === "null";
    if (link.name === "My trades")
      return addressContext && addressContext !== "null";
    return true;
  });

  console.log("supported", userState?.supportedChain);

  return (
    <>
      <AnimatePresence mode="wait">
        {showConnect && (
          <Connect
            //action="createTrade"
            handleClose={handleClose}
            //handleCreate={handleCreate}
          />
        )}
        {showCreate && <Create handleClose={handleClose} />}
      </AnimatePresence>

      <header className={style.container}>
        <div className={style.content}>
          <Link href="/" className={style.logo}>
            <Image src={Logo} alt="tradebase" />
          </Link>
          <nav className={style.nav}>
            {/* {addressContext && addressContext !== "null" && ( */}
            <div className={style.navLinks}>
              {links.map((link: any, index: any) =>
                link?.name !== currentPage ? (
                  <div className={style.navLink} key={link?.link}>
                    <Link href={link?.link}>
                      {" "}
                      <p>{link?.name}</p>
                    </Link>
                  </div>
                ) : (
                  <div className={style.navLinkActive}>
                    <Image src={link?.icon} alt={link?.name} />
                    <Link href={link?.link}>
                      {" "}
                      <p>{link?.name}</p>
                    </Link>
                  </div>
                )
              )}
            </div>
            {/* )} */}
          </nav>
          <div className={style.navBtn}>
            {!addressContext ||
              (addressContext !== "null" && (
                <button
                  onClick={handleConnect}
                  className={style.walletBtn}
                  onMouseEnter={(e) => setShowDisconnect(true)}
                  onMouseLeave={(e) => setShowDisconnect(false)}
                >
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
                    <p>
                      {addressContext &&
                      !showDisconnect &&
                      addressContext !== "null"
                        ? addressContext.length > 7 &&
                          shortenHex(addressContext)
                        : addressContext &&
                            addressContext !== "null" &&
                            showDisconnect
                          ? "Disconnect"
                          : "Connect"}
                    </p>
                  </>
                </button>
              ))}

            {/* <button onClick={handleModals} className={style.mainBtn}>
              Create Ad
            </button> */}
            {!addressContext || addressContext === "null" ? (
              <button
                onClick={() => setShowConnect(true)}
                className={style.mainBtn}
              >
                Connect wallet
              </button>
            ) : userState?.supportedChain ? (
              <button
                // onClick={handleModals}
                onClick={() => setShowCreate(true)}
                className={style.mainBtn}
              >
                Create Ad
              </button>
            ) : (
              <button
                onClick={() => handleSwitch(84532)}
                className={style.wrBtn}
              >
                Switch network
              </button>
            )}

            {/* <ConnectButton /> */}
          </div>
        </div>
        <HeaderMobile />
      </header>
    </>
  );
};

export default Header;
