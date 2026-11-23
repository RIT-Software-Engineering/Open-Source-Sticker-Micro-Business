import { useEffect, useRef } from "react";
import useConfig from "../config";
import { useRerender } from "./Utility";
import type { StateRef } from "../Types";

/**
 * Use if the application should be assumed to be on a mobile or mobile-ish device
 */
export function useIsMobile(): boolean {
    const config = useConfig();
    const rerender = useRerender("isMobile");

    const state = useRef<boolean>(window.innerWidth < config.mobileWidthCutoffPx);

    // Avoid adding and removing event handlers every time
    const rerenderRef = useRef<StateRef<string>>(rerender);
    rerenderRef.current = rerender;

    useEffect(() => {
        const handler = () => {
            if(window.innerWidth < config.mobileWidthCutoffPx != state.current) {
                state.current = window.innerWidth < config.mobileWidthCutoffPx;
                rerenderRef.current("State changed");
            }
        }

        window.addEventListener("resize", handler);

        return () => {
            window.removeEventListener("resize", handler);
        }
    }, []);

    return state.current;
}

/**
 * Calculate the state difference between renders  
 * Very useful for testing, espsecially with directive rerenders  
 * Pass in an object and it will return added and removed keys and changed reference values
 */
export function useDifference(state: Record<string, unknown>): string[] {
    const lazy = useRef<Record<string, unknown>>(state);

    const diff = [];
    for(const key of Object.keys(lazy.current)) {
        if(!Object.keys(state).includes(key)) {
            diff.push(key);
        } else if(state[key] != lazy.current.key) {
            diff.push(key);
        }
    } for(const key of Object.keys(state)) {
        if(!Object.keys(lazy.current).includes(key)) {
            diff.push(key);
        }
    };

    lazy.current = state;

    return diff;
}