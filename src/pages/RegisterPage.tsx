import { useIdentityContext } from "../context/identity"

export const RegisterPage = () => {
  const { identity } = useIdentityContext()

  if (identity !== null) {
    // TODO: redirect to homepage
    return <>You&apos;re already signed up!</>
  }

  return <></>
}
