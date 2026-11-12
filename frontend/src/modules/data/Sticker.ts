import { randomPick } from "../Utility";

/**
 * Represents a sticker
 */
export type ISticker = {
    /** The id of the sticker */
    id: number;
    /** The name of the sticker */
    name: string;
    /** A description of the sticker */
    description: string;
    /** A url that points to the sticker image */
    designPath: string;
    /** The width of the sticker */
    physicalWidth: number;
    /** The height of the sticker */
    physicalHeight: number;
};

/**
 * Get an example / empty sticker
 * 
 * @param [id=-1] The id of the sticker, defaults to -1 (ie. invalid)
 */
export function GetExampleSticker(id: number = -1): ISticker {
    return {
        id: id,
        designPath: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/" + randomPick(["penrose-tiling", "python", "alphachannel", "caution", "compass", "couch"]) + ".svg",
        name: "Example Sticker" + (id != -1 ? ` ${id}` : ""),
        description: "This is an example sticker!",
        physicalHeight: Math.random() * 10,
        physicalWidth: Math.random() * 10
    };
}