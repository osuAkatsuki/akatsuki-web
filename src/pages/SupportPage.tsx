import { useIdentityContext } from "../context/identity"

export const SupportPage = () => {
  const { identity } = useIdentityContext()

  if (identity === null) {
    return <>Please sign into your account first!</>
  }

  return <></>
}
