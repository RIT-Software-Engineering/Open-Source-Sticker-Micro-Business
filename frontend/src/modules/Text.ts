import en from "../../lang/en.json";
import type { DeepReadonly, ReservedJsonNames } from "./Types";

/**
 * Use the text assets for the application
 */
export default function useText(): DeepReadonly<Omit<typeof en, ReservedJsonNames>> {
    return en;
}

/**
 * Inserts parameter values into a text template  
 * Note that you can't effectively chain this
 * @param asset The text template
 * @param args The parameters to insert
 * @returns The completed template (or at least as many parameters as were provided), extra parameters will be dropped
 */
export function TemplateText(asset: string, ...args: string[]): string {
    for(let i = 0; i < args.length; i++) {
        asset = asset.replace("$".padEnd(7, i.toString()), args[i]);
    } return asset;
}

/**
 * Truncate text longer than the specified length with an ellipsis
 * @param source The source text
 * @param length The length of text to allow
 * @param [ellipsis="..."] The ellipsis to use
 * @returns The resulting string, truncated if needed
 */
export function TruncateText(source: string, length: number, ellipsis: string = "..."): string {
    length = Math.max(length, 0);
    ellipsis = TruncateText(ellipsis, length);
    if(source.length > length) {
        return source.slice(0, Math.max(0, length - ellipsis.length)) + ellipsis;
    } return source;
}