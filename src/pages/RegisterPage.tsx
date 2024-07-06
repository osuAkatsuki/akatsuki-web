import { useIdentityContext } from "../context"

export const RegisterPage = () => {
  const { identity } = useIdentityContext()

  if (identity !== null) {
    // TODO: redirect to homepage
    return <>You're already signed up!</>
  }

  return <></>
}
