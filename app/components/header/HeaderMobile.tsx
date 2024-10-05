"use client";
import React, { useRef } from "react";
import style from "./Header.module.scss";
import Image from "next/image";
import Logo from "@/app/logo.svg";
import Link from "next/link";

import Hamburger from "./ham.svg";
import Close from "./close.svg";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const HeaderMobile = () => {
  const [openMenu, menu, closeMenu, menuBody, menuBtn] = [
    useRef<HTMLImageElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLImageElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.to(menu.current, {
        right: 0,
      });
      tl.to(menuBody.current, { scale: 0.9 }, "-=.6");

      tl.reverse();
      (openMenu.current as HTMLImageElement).onclick = function () {
        tl.reversed(!tl.reversed());
      };
      (closeMenu.current as HTMLImageElement).onclick = function () {
        tl.reversed(!tl.reversed());
      };
    },
    { scope: menu }
  );
  return (
    <div className={style.smContent}>
      <div className={style.smLogo}>
        <Image src={Logo} alt="tradebase" />
      </div>
      <div className={style.hamburger}>
        <Image src={Hamburger} alt="open menu" ref={openMenu} />
      </div>
      <div className={style.menu} ref={menu}>
        <div className={style.close}>
          <Image src={Close} alt="close menu" ref={closeMenu} />
        </div>
        <div className={style.menuBody} ref={menuBody}>
          <ul className={style.menuLinks}>
            <li>
              <Link href="">Home </Link>
            </li>
            <li>
              <Link href="">About</Link>
            </li>
            <li>
              <Link href="">Marketplace</Link>
            </li>
            <li>
              <Link href="">FAQs</Link>
            </li>
          </ul>
          <div className={style.menuBtn} ref={menuBtn}>
            <button>Sell on base</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;
