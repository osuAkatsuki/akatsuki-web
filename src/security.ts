import * as EmailValidator from "email-validator"

const VALID_USERNAME_REGEX = /^[A-Za-z0-9 _\[\]-]{2,15}$/

export const validateEmail = (email: string): boolean => {
  // Validates that the email address is in a valid format.
  // Uses the email-validator library to check the format.
  return EmailValidator.validate(email)
}

export const validateUsername = (username: string): boolean => {
  // Validates that the username meets the security requirements.
  // - Must be between 2 and 15 characters long
  // - Must contain only alphanumeric characters, spaces, underscores, hyphens, and square brackets
  // - Must not contain space and underscore at the same time
  if (!VALID_USERNAME_REGEX.test(username)) {
    return false
  }
  if (username.includes(" ") && username.includes("_")) {
    return false
  }
  return true
}

export const validatePassword = (password: string): boolean => {
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
