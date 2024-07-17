import { useIdentityContext } from "../context/identity"
import { useUiStateContext } from "../context/ui-state"

export const RegisterPage = () => {
  const { identity } = useIdentityContext()

  const { setUiState } = useUiStateContext()

  setUiState({ navbarVariant: "light" })

  if (identity !== null) {
    // TODO: redirect to homepage
    return <>You're already signed up!</>
  }

  return <></>
}
