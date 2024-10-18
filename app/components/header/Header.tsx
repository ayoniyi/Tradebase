import React from "react";
import style from "./Header.module.scss";
import Image from "next/image";
import Logo from "@/app/logo.svg";
import Link from "next/link";

import HeaderMobile from "./HeaderMobile";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  return (
    <header className={style.container}>
      <div className={style.content}>
        <div className={style.logo}>
          <Image src={Logo} alt="tradebase" />
        </div>
        <nav className={style.nav}>
          <div className={style.navLinks}>
            {/* <Link href="/">
              {" "}
              <p>Home</p>
            </Link>
            <Link href="/about">
              {" "}
              <p>About us</p>
            </Link>
            <Link href="/marketplace">
              {" "}
              <p>Marketplace</p>
            </Link>
            <Link href="/#faq">
              {" "}
              <p>FAQs</p>
            </Link> */}
          </div>
        </nav>
        <div className={style.navBtn}>
          <button>Create trade</button>
          <button>Marketplace</button>
          {/* <ConnectButton /> */}
        </div>
      </div>
      <HeaderMobile />
    </header>
  );
};

export default Header;
