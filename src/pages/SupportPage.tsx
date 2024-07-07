import { useIdentityContext } from "../context"

export const SupportPage = () => {
  const { identity } = useIdentityContext()

  if (identity === null) {
    // TODO: redirect to homepage
    return <>Please sign into your account first!</>
  }

  return <></>
}
