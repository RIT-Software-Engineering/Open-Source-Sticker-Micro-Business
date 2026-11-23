import { useReducer, type Ref } from "react";
import type { StateRef } from "../Types";

/**
 * Wrapped on-demand rerenders  
 * Noe that this is a stub, implement tracing if it's needed
 * @param name The name of the rerenderer
 * @returns A rerenderer, pass why you are calling it
 */
export function useRerender(name: string): StateRef<string> {
    name; // Get rid of the warning
    const handle = useReducer(_ => Math.random(), 0)[1];
    
    return (_reason: string) => {
        handle();
    };
}

/**
 * Picks a random item from the source
 */
export function RandomPick<T>(source: T[]): T {
    return source[Math.floor(Math.random() * source.length)];
}

/**
 * Bind an out ref value to an out ref reference
 */
export function BindRef<T>(ref: Ref<T> | undefined, value: T) {
    if(ref == null) return;

    if(typeof ref == "function") {
        ref(value);
    } else {
        ref.current = value;
    }
}

/**
 * Flip a one-to-one mapping
 */
export function Backmap<T extends number | string | symbol, S extends number | string | symbol>(map: Readonly<Record<T, S>>): Record<S, T> {
    const backmap: Record<S, T> = {} as Record<S, T>;
    for(const key of Object.keys(map) as T[]) {
        backmap[map[key]] = key;
    } return backmap
}

// https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
];

/**
 * Is the file a valid image type
 */
export function IsValidImageType(file: File) {
    return fileTypes.includes(file.type);
}