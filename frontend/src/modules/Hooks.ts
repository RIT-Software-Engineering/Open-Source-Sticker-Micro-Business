import { useEffect, useRef, useState } from "react";
import useConfig from "../config";
import { useRerender } from "./Utility";
import type { StateRef } from "../Types";

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