import React from "react";

const IDENTITY_CACHE_KEY = "identity";

interface Identity {
  userId: number;
}

export type IdentityContextType = {
  identity: Identity | null;
  setIdentity: (identity: Identity | null) => void;
};

export const IdentityContext = React.createContext<IdentityContextType | undefined>(undefined);

export const useIdentityContext = () => {
  const identityContext = React.useContext(IdentityContext);
  if (identityContext === undefined) {
    throw new Error("useIdentityContext must be inside a IdentityContextProvider");
  }
  return identityContext;
};

interface Props {
  children: React.ReactNode;
}

export const setIdentityInLocalStorage = (identity: Identity) => {
  localStorage.setItem(IDENTITY_CACHE_KEY, JSON.stringify(identity));
};

export const getIdentityFromLocalStorage = (): Identity | null => {
  const cached = localStorage.getItem(IDENTITY_CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
};

export const removeIdentityFromLocalStorage = () => {
  localStorage.removeItem(IDENTITY_CACHE_KEY);
};

export const IdentityContextProvider: React.FC<Props> = ({ children }) => {
  const [identity, setIdentity] = React.useState<Identity | null>(getIdentityFromLocalStorage());
  return (
    <IdentityContext.Provider
      value={{
        identity,
        setIdentity: (value: React.SetStateAction<Identity | null>) => {
          if (value) {
            setIdentityInLocalStorage(value as Identity);
          } else {
            removeIdentityFromLocalStorage();
          }
          setIdentity(value);
        },
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
};
