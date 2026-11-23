import { trimDecimalRe } from "./Regex";

/** The difference between byte margins */
const BYTE_MARGIN_DELTA = Math.pow(2, 10);
/** Byte margin lookup */
export const BYTE_MARGINS = {
    B  : Math.pow(BYTE_MARGIN_DELTA, 0),
    KiB: Math.pow(BYTE_MARGIN_DELTA, 1),
    MiB: Math.pow(BYTE_MARGIN_DELTA, 2),
    GiB: Math.pow(BYTE_MARGIN_DELTA, 3),
    TiB: Math.pow(BYTE_MARGIN_DELTA, 4)
} as const;
/** The maximum allowed byte margin */
const BYTE_MAX_MARGIN: keyof typeof BYTE_MARGINS = "TiB";

type IFormatAsBytesConfig = {
    /** The format separator (defaults to " ") */
    separator?: string | undefined;
    /** The format precision (defaults to 2) */
    precision?: number | undefined;
}

/**
 * Format a value as a byte value
 */
export function FormatAsBytes(source: number, config: IFormatAsBytesConfig | null = null): string {
    let {separator, precision} = config ?? {};
    if(separator == null) separator = " ";
    if(precision == null) precision = 2;

    for(const margin of Object.keys(BYTE_MARGINS) as (keyof typeof BYTE_MARGINS)[]) {
        // Handle tibs
        if(margin == BYTE_MAX_MARGIN) {
            return (source == BYTE_MARGINS.TiB ? "" : ">") + "1" + separator + BYTE_MAX_MARGIN;
        }

        // Handle everything else (look above and if less, then it must be in this margin)
        // Then divide by margin and return
        const marginValue = BYTE_MARGINS[margin];
        if(source < marginValue * BYTE_MARGIN_DELTA) {
            const value = source / marginValue;
            let result: string;
            if(precision >= 0) {
                result = value.toFixed(precision).replace(trimDecimalRe, "");
            } else {
                result = value.toString();
            }

            return result + separator + margin;
        }
    } return ">1" + separator + BYTE_MAX_MARGIN; // Otherwise, must be too big
}