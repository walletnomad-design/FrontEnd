/*
 *Valida formato basico de email. No es exhaustivo (tarea del backend)
 *es solo feedback rapido en el formulario.
 */
export function isValidEmail(email: string): boolean {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_REGEX.test(email.trim());
}

/**
 * Regla mínima de password para el frontend. El hash y las reglas
 * "de verdad" las define P3 en el backend — esto es solo UX.
 */
export function isValidPassword(password: string): boolean {
    return password.length >= 6;
}

export interface LoginFormErrors {
    email?: string;
    password?: string;
}
/**
 * Valida los campos de Login/Register y devuelve un objeto de errores
 * listo para mostrar debajo de cada input. Objeto vacío = formulario válido.
 */
export function validateLoginForm(email: string, password: string): LoginFormErrors {
    const errors: LoginFormErrors = {};
    if (!email.trim()) {
        errors.email = "El email es obligatorio";
    }
    if(!password) {
        errors.password = "La contresaña es obligatoria";
    }else if (!isValidPassword(password)) {
        errors.password = "La contresaña debe tener al menos 6 caracteres";
    }
    return errors;
}
