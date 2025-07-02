"use client";
import React, { createContext, useEffect, useState, ReactNode } from "react";
// import useNotifications from "../utils/functions/useNotifications";
// import { db } from "../utils/firebase";

interface UserState {
  user: any;
  address: any;
  supportedChain: boolean;
}

const userString =
  typeof window !== "undefined" ? localStorage.getItem("userContext") : null;
const user = userString ? JSON.parse(userString) : null;
const addString =
  typeof window !== "undefined" ? localStorage.getItem("addContext") : null;
//const add = addString ? JSON.parse(addString) : null;

const INITIAL_STATE: UserState = {
  user: user,
  address: addString ? addString : null,
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
  const [userState, setUserState] = useState<UserState>(INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("userContext", JSON.stringify(userState?.user));
    localStorage.setItem("addContext", userState?.address);
    localStorage.setItem(
      "supportedChain",
      JSON.stringify(userState?.supportedChain)
    );
  }, [userState]);

  return (
    <UserContext.Provider value={[userState, setUserState]}>
      {children}
    </UserContext.Provider>
  );
};
