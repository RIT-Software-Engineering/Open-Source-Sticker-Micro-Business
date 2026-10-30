import { createContext, useContext, type Context, type CSSProperties } from "react";
import tinycolor2 from "tinycolor2";

/**
 * This is pretty complicated, but it seems like the only way to get the styles from the spec  
 * It doesn't seem to be doable from just CSS
 * Pretty easy to use once you get used to it
 */

/** A way to look up palattes by color */
const palatteLookup: Map<string, Palatte> = new Map();

/**
 * A color palatte
 */
class Palatte {
    /** The palatte definition (colors in it) */
    private def: string[];
    /** Backmap for color indices */
    private lookup: Map<string, number>;
    /** The root color of the palatte */
    private _root: number;

    /**
     * @param def The colors in the palatte
     * @param root The root color of the palatte
     */
    constructor(def: string[], root: number) {
        // Update the palatte by color lookup table
        for(const color of def) {
            palatteLookup.set(color, this);
        }

        this._root = root;
        this.def = def;
        this.lookup = new Map();

        // Build the color index backmap
        for(let i = 0; i < def.length; i++) {
            this.lookup.set(def[i], i);
        }
    }

    /**
     * The root color of the palatte
     */
    public get root(): string {
        return this.def[this._root];
    }

    /**
     * Returns the lightest color of the palatte
     * @param _value For consistency
     */
    public Lightest(_value: string | undefined = undefined): string {
        return this.def[0];
    }

    /**
     * Returns a lighter color in the palatte than the one specified
     * @param value [=root] The color to start at
     * @param factor [=0.5] About how much lighter should the result be from the source
     * @returns The lighter color
     */
    public Lighter(value: string | undefined = undefined, factor: number = 0.5): string {
        if(value == null) value = this.root;
        const index = this.lookup.get(value);
        if(index == null) return value;
        if(index === 0) return value;
        return this.def[Math.round(index * factor)];
    }

    /**
     * Returns the next lightest color in the palatte from the one specified
     * @param value [=root] The color to start at
     */
    public Light(value: string | undefined = undefined): string {
        if(value == null) value = this.root;
        const index = this.lookup.get(value);
        if(index == null) return value;
        if(index === 0) return value;
        return this.def[index - 1];
    }

    /**
     * Is some color present in the palatte?
     */
    public Has(value: string): boolean {
        return this.lookup.has(value);
    }

    /**
     * Returns the next darkest color in the palatte from the one specified
     * @param value [=root] The color to start at
     */
    public Dark(value: string | undefined = undefined): string {
        if(value == null) value = this.root;
        const index = this.lookup.get(value);
        if(index == null) return value;
        if(index === this.def.length - 1) return value;
        return this.def[index + 1];
    }

    /**
     * Returns a darker color in the palatte than the one specified
     * @param value [=root] The color to start at
     * @param factor [=0.5] About how much darker should the result be from the source
     * @returns The darker color
     */
    public Darker(value: string | undefined = undefined, factor: number = 0.5): string {
        if(value == null) value = this.root;
        const index = this.lookup.get(value);
        if(index == null) return value;
        if(index === this.def.length - 1) return value;
        return this.def[index + Math.round((this.def.length - 1 - index) * factor)];
    }

    /**
     * Returns the darkest color of the palatte
     * @param _value For consistency
     */
    public Darkest(_value: string | undefined = undefined): string {
        return this.def[this.def.length - 1];
    }
}

const primaryPalatte = new Palatte([
    "#EDEDFD",
    "#C8C9F9",
    "#8A8BF1",
    "#6D6FEE",
    "#484BEA",
    "#2427E5",
    "#181BC9"
], 2);

const secondaryPalatte = new Palatte([
    "#FFEBC2",
    "#FFE4AD",
    "#FFCF70",
    "#FFC247",
    "#FFB41F",
    "#F5A300",
    "#CC8800"
], 2);

const neutralPalatte = new Palatte([
    "#EFF2F3",
    "#BECACF",
    "#A3B4BC",
    "#7B939F",
    "#607D8B",
    "#435861",
    "#3B4C55"
], 2);

const successPalatte = new Palatte([
    "#EDF7EE",
    "#B6DEB7",
    "#97D19A",
    "#6ABD6E",
    "#4CAF50",
    "#357A38",
    "#2E6B31"
], 3);

const errorPalatte = new Palatte([
    "#FBF0EF",
    "#F3D3CE",
    "#EBB6AD",
    "#DF8B7C",
    "#D35F4A",
    "#B5402C",
    "#943524"
], 4);

function FindPalatte(value: string): Palatte {
    const palatte = palatteLookup.get(value);
    return palatte ?? neutralPalatte;
}

const light = "white";
const dark = "black"

function TextColor(source: CSSProperties["color"]): CSSProperties["color"] {
    if(tinycolor2(source).getLuminance() < 0.1791) return light;
    return dark;
}

interface IColors {
    /** Primary colors for the application */
    primaryPalatte  : Palatte,
    /** Secondary colors for the application */
    secondaryPalatte: Palatte,
    /** Neutral colors (greys) */
    neutralPalatte  : Palatte,
    /** Success colors (greens) */
    successPalatte  : Palatte,
    /** Error colors (reds) */
    errorPalatte    : Palatte,
    /** The primary color for the application */
    primary         : Palatte["root"],
    /** The secondary color for the application */
    secondary       : Palatte["root"],
    /** A neutral grey */
    neutral         : Palatte["root"],
    /** The success color */
    success         : Palatte["root"],
    /** The error color */
    error           : Palatte["root"],
    /** White */
    light           : typeof light,
    /** Black */
    dark            : typeof dark,
    /** Find a palatte given a color */
    FindPalatte     : typeof FindPalatte,
    /** Find constrasting text color given a background color */
    TextColor       : typeof TextColor
}

/** The public colors object */
const colors: Readonly<IColors> = Object.freeze({
    primaryPalatte,
    secondaryPalatte,
    neutralPalatte,
    successPalatte,
    errorPalatte,
    primary  : primaryPalatte.root,
    secondary: secondaryPalatte.root,
    neutral  : neutralPalatte.root,
    success  : successPalatte.root,
    error    : errorPalatte.root,
    light,
    dark,
    FindPalatte,
    TextColor
});

/**
 * The color context object
 */
const ColorContext: Context<typeof colors> = createContext(colors);

/**
 * Hook to use dynamic colors
 */
export function useColors(): typeof colors {
    return useContext(ColorContext);
}