"use client";
import React, { createContext, useEffect, useState, ReactNode } from "react";

interface UserState {
  user: any;
  address: string | null;
  supportedChain: boolean;
}

const INITIAL_STATE: UserState = {
  user: null,
  address: null,
  supportedChain: false,
};

export const UserContext = createContext<
  [UserState, React.Dispatch<React.SetStateAction<UserState>>]
>([INITIAL_STATE, () => {}]);

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [userState, setUserState] = useState<UserState>(() => {
    // this function only runs once, client‑side, after hydration
    if (typeof window === "undefined") {
      return INITIAL_STATE;
    }

    const rawUser = localStorage.getItem("userContext");
    const rawAdd = localStorage.getItem("addContext");
    const rawSupport = localStorage.getItem("supportedChain");

    return {
      user: rawUser ? JSON.parse(rawUser) : null,
      address: rawAdd, // either string or null
      supportedChain: rawSupport ? JSON.parse(rawSupport) : false,
    };
  });

  useEffect(() => {
    // sync every time userState changes
    localStorage.setItem("userContext", JSON.stringify(userState.user));

    // only overwrite addContext if we actually have a value
    if (userState.address !== null) {
      localStorage.setItem("addContext", userState.address);
    }

    localStorage.setItem(
      "supportedChain",
      JSON.stringify(userState.supportedChain)
    );
  }, [userState]);

  return (
    <UserContext.Provider value={[userState, setUserState]}>
      {children}
    </UserContext.Provider>
  );
};
