/**
 * Trim trailing zeros from a number string
 * 
 * Ie. 12.000 -> 12 or 12.3400 -> 12.34
 */
export const trimTrailingZerosRe = /\.?0*$/;