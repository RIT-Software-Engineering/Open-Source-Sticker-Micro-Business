import { createContext, useContext, type Context, type CSSProperties } from "react";
import tinycolor2 from "tinycolor2";

const palatteLookup: Map<string, Palatte> = new Map();

class Palatte {
    private def: string[];
    private lookup: Map<string, number>;
    private _root: number;

    constructor(def: string[], root: number) {
        for(const color of def) {
            palatteLookup.set(color, this);
        }

        this._root = root;
        this.def = def;
        this.lookup = new Map();
        for(let i = 0; i < def.length; i++) {
            this.lookup.set(def[i], i);
        }
    }

    public get root(): string {
        return this.def[this._root];
    }

    public Lightest(_value: string | undefined = undefined): string {
        return this.def[0];
    }

    public Lighter(value: string | undefined = undefined): string {
        if(value == null) value = this.root;
        const index = this.lookup.get(value);
        if(index == null) return value;
        if(index === 0) return value;
        return this.def[Math.round(index / 2)];
    }

    public Light(value: string | undefined = undefined): string {
        if(value == null) value = this.root;
        const index = this.lookup.get(value);
        if(index == null) return value;
        if(index === 0) return value;
        return this.def[index - 1];
    }

    public Has(value: string): boolean {
        return this.lookup.has(value);
    }

    public Dark(value: string | undefined = undefined): string {
        if(value == null) value = this.root;
        const index = this.lookup.get(value);
        if(index == null) return value;
        if(index === this.def.length - 1) return value;
        return this.def[index + 1];
    }

    public Darker(value: string | undefined = undefined): string {
        if(value == null) value = this.root;
        const index = this.lookup.get(value);
        if(index == null) return value;
        if(index === this.def.length - 1) return value;
        return this.def[index + Math.round((this.def.length - 1 - index) / 2)];
    }

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

const palattes = Object.freeze({
    primaryPalatte,
    secondaryPalatte,
    neutralPalatte,
    successPalatte,
    errorPalatte
});

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

const colors = Object.freeze({
    ...palattes,
    primary: primaryPalatte.root,
    secondary: secondaryPalatte.root,
    neutral: neutralPalatte.root,
    success: successPalatte.root,
    error: errorPalatte.root,
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