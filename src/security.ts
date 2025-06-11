export const validatePasswordMeetsRequirements = (
  password: string
): boolean => {
  // Validates that the password meets the security requirements.
  // - Must be at least 8 characters long
  // - Must contain at least one digit
  // - Must contain at least one uppercase letter
  // - Must contain at least one lowercase letter
  if (password.length < 8) {
    return false
  }
  if (!/\d/.test(password)) {
    return false
  }
  if (!/[A-Z]/.test(password)) {
    return false
  }
  if (!/[a-z]/.test(password)) {
    return false
  }
  return true
}
