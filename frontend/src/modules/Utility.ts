import { useReducer } from "react";
import type { StateRef } from "../Types";

/**
 * Wrapped on-demand rerenders  
 * Noe that this is a stub, implement tracing if it's needed
 * @param name The name of the rerenderer
 * @returns A rerenderer, pass why you are calling it
 */
export function useRerender(name: string): StateRef<string> {
    const handle = useReducer(_ => Math.random(), 0)[1];
    
    return (_reason: string) => {
        handle();
    };
}