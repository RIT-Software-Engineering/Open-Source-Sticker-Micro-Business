import { type CSSProperties } from "react";
import { useColors } from "../../modules/Colors";

/** Available sizes of various control components */
export type EControlableSize   = "large" | "medium" | "small" | "tiny" | "none";

/** States that control components can be in */
export type IControllableState = {
    /** Is the controllable active? (clicked, focused, etc.) */
    active: boolean;
    /** Is the mouse inside the controllable? (hovered, etc.) */
    inside: boolean;
}

export interface IControllableFlags {
    /** Is the controllable silent (ie. state changes are not shown) */
    silent?  : boolean | undefined;
    /** Is the controllable disabled */
    disabled?: boolean | undefined;
    /** Is the controllable light-on-dark instead of dark-on-light */
    inverted?: boolean | undefined
}

/**
 * Color states for a controllable
 */
export interface IControllableColor {
    /** The shading color of the controllable (overlay) */
    shade: CSSProperties["color"];
    /** The text color of the controllable */
    text : CSSProperties["color"];
    /** The background color of the controllable */
    back : CSSProperties["color"];
}

/**
 * Determines the color for a controllable
 * @param naturalColor The root color of the controllable
 * @param state The state of the controllable
 * @param flags Flags for the controllable that affect the color
 * @returns 
 */
export function useControllableColor(naturalColor: CSSProperties["color"], {active, inside}: IControllableState, {silent, disabled, inverted}: IControllableFlags): IControllableColor {
    const colors = useColors();

    if(silent) {
        active = false;
        inside = false;
    }
    /** The palatte that the controllable is using */
    const palatte = naturalColor == null ? colors.neutralPalatte : colors.FindPalatte(naturalColor);

    // Determine the color of the controllable
    let shade: CSSProperties["color"] = undefined;
    let text : CSSProperties["color"] = undefined;
    let back : CSSProperties["color"] = undefined;
    if(naturalColor != null && palatte.Has(naturalColor)) {
        // Palatte color
        if(disabled) {
            back = colors.neutralPalatte.Dark(colors.neutralPalatte.Lightest());
            text = colors.TextColor(back);
        } else {
            if(!inverted) {
                // Text color is primary
                if(active) {
                    back = naturalColor;
                    text = colors.TextColor(back);
                } else if(inside) {
                    back = palatte.Light(naturalColor);
                    text = naturalColor;
                } else {
                    text = naturalColor;
                }
            } else {
                // Background color is primary
                if(active) {
                    back = palatte.Dark(palatte.Dark(naturalColor));
                } else if(inside) {
                    back = palatte.Dark(naturalColor);
                } else {
                    back = naturalColor;
                }

                text = colors.TextColor(back);
            }
        }
    } else {
        // No color or non-palatte color
        if(disabled) {
            // If the controllable is disabled, set the color to disabled
            shade = "#80808060"
        } else {
            if(active) {
                // If the controllable is held, make it really dark
                shade = "#80808080";
            } else if(inside) {
                // If the controllable is hovered, make it darker
                shade = "#80808050";
            } else {
                back = naturalColor;
            }
        }
    }

    return {shade, back, text};
}