import type {Currency} from "../types";

//Mapea cada moneda  a su locale/formato de visualisación
const CURRENCY_LOCALE: Record<Currency, string> = {
    "COP": "es-CO",
    "USD": "en-US",
    "EUR": "de-DE"
};

/**
 * Formatea un monto numerico como texto de moneda legible
 * Ej: formatAmount(1000, "COP") => "$1,000.00 COP"
 *     formatAmount(1000, "USD") => "$1,000.00 USD"
 */

export function formatAmount(amount: number, currency: Currency): string {
    return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
        style: "currency",
        minimumFractionDigits: currency === "COP" ? 0 : 2,
        maximumFractionDigits: currency === "COP" ? 0 : 2,
    }).format(amount);
}

//Simbolo corto para mostrar junto al label de cada balance, si no queres
//Usar el formato completo de intl (por ejemplo, en un badge chico)
export const CURRENCY_SYMBOL: Record<Currency, string> = {
    "COP": "$",
    "USD": "$",
    "EUR": "€"
};
