/**
 * Valida formato básico de email. No es exhaustivo (eso lo hace el backend),
 * es solo feedback rápido en el formulario.
 */
export function isValidEmail(email: string): boolean {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Password segura: mínimo 8 caracteres, y alfanumérica de verdad
 * (al menos una letra Y al menos un número, no alcanza con solo uno de los dos).
 */
export function isValidPassword(password: string): boolean {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasMinLength && hasLetter && hasNumber;
}

export function isValidDni(dni: string): boolean {
  // Solo dígitos, entre 7 y 9 caracteres (cubre DNI de varios países LatAm).
  return /^\d{7,9}$/.test(dni.trim());
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface RegisterFormErrors extends LoginFormErrors {
  firstName?: string;
  lastName?: string;
  dni?: string;
}

export function validateLoginForm(email: string, password: string): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!email.trim()) {
    errors.email = "El email es obligatorio";
  } else if (!isValidEmail(email)) {
    errors.email = "El email no tiene un formato válido";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria";
  }
  // En Login no exigimos la regla fuerte: si alguien ya tiene una cuenta
  // vieja con password mas simple, no la bloqueamos aca. Eso lo valida
  // el backend contra lo que ya esta guardado.

  return errors;
}

export function validateRegisterForm(
  firstName: string,
  lastName: string,
  dni: string,
  email: string,
  password: string
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  if (!firstName.trim()) {
    errors.firstName = "El nombre es obligatorio";
  }

  if (!lastName.trim()) {
    errors.lastName = "El apellido es obligatorio";
  }

  if (!dni.trim()) {
    errors.dni = "El DNI es obligatorio";
  } else if (!isValidDni(dni)) {
    errors.dni = "El DNI debe tener entre 7 y 9 números";
  }

  if (!email.trim()) {
    errors.email = "El email es obligatorio";
  } else if (!isValidEmail(email)) {
    errors.email = "El email no tiene un formato válido";
  }

  if (!password) {
    errors.password = "La contraseña es obligatoria";
  } else if (!isValidPassword(password)) {
    errors.password = "Mínimo 8 caracteres, con letras y números";
  }

  return errors;
}