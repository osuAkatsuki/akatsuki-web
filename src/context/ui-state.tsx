import React from "react"

export interface UiState {
  navbarVariant: "dark" | "light"
}

export type UiStateContextType = {
  uiState: UiState
  setUiState: (uiState: UiState) => void
}

export const UiStateContext = React.createContext<UiStateContextType | null>(
  null
)

export const useUiStateContext = () => {
  const uiStateContext = React.useContext(UiStateContext)
  if (uiStateContext === null) {
    throw new Error("useUiStateContext must be inside a UiStateContextProvider")
  }
  return uiStateContext
}

interface Props {
  children: React.ReactNode
}

export const setUiStateInLocalStorage = (uiState: UiState) => {
  localStorage.setItem("uiState", JSON.stringify(uiState))
}

export const getUiStateFromLocalStorage = (): UiState | null => {
  const cached = localStorage.getItem("uiState")
  return cached ? JSON.parse(cached) : null
}

export const removeUiStateFromLocalStorage = () => {
  localStorage.removeItem("uiState")
}

export const UiStateContextProvider: React.FC<Props> = ({ children }) => {
  const [uiState, setUiState] = React.useState<UiState>(
    getUiStateFromLocalStorage() || { navbarVariant: "dark" }
  )
  return (
    <UiStateContext.Provider
      value={{
        uiState,
        setUiState: (value: React.SetStateAction<UiState>) => {
          if (value) {
            setUiStateInLocalStorage(value as UiState)
          } else {
            removeUiStateFromLocalStorage()
          }
          setUiState(value)
        },
      }}
    >
      {children}
    </UiStateContext.Provider>
  )
}
