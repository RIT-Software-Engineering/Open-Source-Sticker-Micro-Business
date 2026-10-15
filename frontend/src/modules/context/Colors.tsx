import { createContext, useContext, useEffect, type Context, } from "react";
import Listener from "../Listener";
import { useRerender } from "../Utility";
import config from "../../../config.json";

// Colors
const sourceColors = config.colors;
const colors = {} as Record<string, string>;

// Color modes
type ColorMode = "light" | "dark";
let mode: ColorMode = "light";

// Color listeners
class ColorListeners extends Listener {
    public NotifyColorListeners() {
        this.NotifyListeners();
    }
} const colorListeners = new ColorListeners();

/**
 * Set color mode
 * @param value 
 */
function SetMode(value: ColorMode) {
    if(value != mode) {
        mode = value;
        colorListeners.NotifyColorListeners();
    }
}

/**
 * Get color mode
 * @returns 
 */
function GetMode(): ColorMode {
    return mode;
}

/**
 * Reload color structure with the current mode
 */
function Reload() {
    for(const key of [...Object.keys(colors)]) {
        delete colors[key];
    }

    (colors as any).SetMode = SetMode;
    (colors as any).GetMode = GetMode;
    
    for(const color of Object.keys(sourceColors)) {
        if(color == "light" || color == "dark") {
            if(color == mode) {
                const latentScope = sourceColors[color] as Record<string, string>;
                for(const latentColor of Object.keys(latentScope)) {
                    colors[latentColor] = latentScope[latentColor];
                }
            }
        } else {
            colors[color] = (sourceColors as unknown as Record<string, string>)[color];
        }
    }
}

// Load the color object
Reload();
colorListeners.AddListener(Reload);

/**
 * The color type object
 */
type ColorStructure = {
    [K in Exclude<keyof typeof sourceColors, "light" | "dark">]: string
} & {
    [K in keyof typeof sourceColors.light]: typeof sourceColors.light[K]
} & {
    SetMode: typeof SetMode,
    GetMode: typeof GetMode
};

/**
 * The color context object
 */
const ColorContext: Context<ColorStructure> = createContext(colors as any as ColorStructure);

/**
 * Hook to use dynamic colors
 */
export function useColors(): ColorStructure {
    const rerender = useRerender();

    useEffect(() => {
        const handle = colorListeners.AddListener(() => rerender("Color state changed"));

        return () => {
            handle.Remove();
        }
    }, []);

    return useContext(ColorContext);
}