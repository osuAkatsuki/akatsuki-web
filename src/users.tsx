import React from "react";
import type { WebSession } from "./interfaces/webSessions";
import type { Account } from "./interfaces/accounts";

interface User {
  session: WebSession;
  account: Account;
}

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const userContext = React.useContext(UserContext);
  if (userContext === undefined) {
    throw new Error("useUserContext must be inside a UserContextProvider");
  }
  return userContext;
};

interface Props {
  children: React.ReactNode;
}

// TODO: store user data in cookies as opposed to local storage

export const setUserInLocalStorage = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserFromLocalStorage = () => {
  const cached = localStorage.getItem("user");
  if (cached) {
    const parsed = JSON.parse(cached) as User;
    if (new Date() >= parsed.session.expiresAt) {
      // value in local storage has expired
      removeUserFromLocalStorage();
      return null;
    }
    return parsed;
  }
  return null;
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
};

export const UserContextProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(getUserFromLocalStorage());
  return (
    <UserContext.Provider
      value={{
        user,
        setUser: (value: React.SetStateAction<User | null>) => {
          if (value) {
            setUserInLocalStorage(value as User);
          } else {
            removeUserFromLocalStorage();
          }
          setUser(value);
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
