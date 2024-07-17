import { useIdentityContext } from "../context/identity"
import { useUiStateContext } from "../context/ui-state"

export const SupportPage = () => {
  const { identity } = useIdentityContext()

  const { setUiState } = useUiStateContext()

  setUiState({ navbarVariant: "light" })

  if (identity === null) {
    return <>Please sign into your account first!</>
  }

  return <></>
}
