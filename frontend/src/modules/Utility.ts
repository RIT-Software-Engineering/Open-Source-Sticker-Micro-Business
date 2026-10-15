import { useReducer } from "react";
import type { StateRef } from "../Types";

export function useRerender(): StateRef<string> {
    const handle = useReducer(_ => Math.random(), 0)[1];
    
    return (_reason: string) => {
        handle();
    };
}