"use client";
import React, { createContext, useEffect, useState, ReactNode } from "react";

interface UserState {
  user: any;
  isFetching: boolean;
  error: boolean;
}

const userString =
  typeof window !== "undefined" ? localStorage.getItem("userContext") : null;
const user = userString ? JSON.parse(userString) : null;

const INITIAL_STATE: UserState = {
  user: user,
  isFetching: false,
  error: false,
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
    localStorage.setItem("userContext", JSON.stringify(userState.user));
  }, [userState.user]);

  return (
    <UserContext.Provider value={[userState, setUserState]}>
      {children}
    </UserContext.Provider>
  );
};
