/**
 * Authentication error messages
 * Maps Firebase error codes to user-friendly messages
 */

export const AUTH_ERRORS = {
  // Email/Password errors
  EMAIL_ALREADY_IN_USE: "Este correo ya está registrado",
  INVALID_CREDENTIALS: "Correo o contraseña incorrectos",
  USER_NOT_FOUND: "No existe una cuenta con este correo",
  WRONG_PASSWORD: "Contraseña incorrecta",
  WEAK_PASSWORD: "La contraseña debe tener al menos 6 caracteres",
  INVALID_EMAIL: "Correo electrónico inválido",

  // Google auth errors
  POPUP_BLOCKED:
    "El popup fue bloqueado. Por favor permite popups para este sitio",
  POPUP_CLOSED: "Cerraste la ventana de autenticación",

  // Database errors
  USER_DATA_NOT_FOUND: "No se encontraron los datos del usuario",
  FAILED_TO_CREATE_USER: "Error al crear el usuario en la base de datos",

  // Generic
  NETWORK_ERROR: "Error de conexión. Verifica tu internet",
  UNKNOWN_ERROR: "Ocurrió un error inesperado",
} as const;

/**
 * Maps Firebase error codes to our error messages
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return AUTH_ERRORS.UNKNOWN_ERROR;
  }

  const message = error.message.toLowerCase();

  // Firebase error codes
  if (message.includes("email-already-in-use")) {
    return AUTH_ERRORS.EMAIL_ALREADY_IN_USE;
  }
  if (
    message.includes("invalid-credential") ||
    message.includes("invalid-login-credentials")
  ) {
    return AUTH_ERRORS.INVALID_CREDENTIALS;
  }
  if (message.includes("user-not-found")) {
    return AUTH_ERRORS.USER_NOT_FOUND;
  }
  if (message.includes("wrong-password")) {
    return AUTH_ERRORS.WRONG_PASSWORD;
  }
  if (message.includes("weak-password")) {
    return AUTH_ERRORS.WEAK_PASSWORD;
  }
  if (message.includes("invalid-email")) {
    return AUTH_ERRORS.INVALID_EMAIL;
  }
  if (message.includes("popup-blocked")) {
    return AUTH_ERRORS.POPUP_BLOCKED;
  }
  if (
    message.includes("popup-closed-by-user") ||
    message.includes("cancelled-popup-request")
  ) {
    return AUTH_ERRORS.POPUP_CLOSED;
  }
  if (message.includes("network")) {
    return AUTH_ERRORS.NETWORK_ERROR;
  }

  return error.message || AUTH_ERRORS.UNKNOWN_ERROR;
}
