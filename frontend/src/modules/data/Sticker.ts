import { RandomPick } from "../Utility";
import type { ITag } from "./Tag";

type IStickerBase = {
    /** The name of the sticker */
    name          : string;
    /** A description of the sticker */
    description   : string;
    /** The width of the sticker */
    physicalWidth : number;
    /** The height of the sticker */
    physicalHeight: number;
}

/**
 * Represents a client-only sticker
 */
export type ILocalSticker = {
    /** The design of the sticker */
    design        : File;
    /** The tags for the sticker */
    tags          : string[];
} & IStickerBase;

/**
 * Represents a sticker
 */
export type ISticker = {
    /** The id of the sticker */
    id            : number;
    /** A url that points to the sticker image */
    designPath    : string;
    /** Tags for the sticker */
    tags          : ITag[];
} & IStickerBase;

/**
 * Get an example sticker  
 * Testing utility
 * 
 * @param [id=-1] The id of the sticker, defaults to -1 (ie. invalid)
 */
export function GetExampleSticker(id: number = -1): ISticker {
    return {
        id,
        designPath: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/" + RandomPick(["penrose-tiling", "python", "alphachannel", "caution", "compass", "couch"]) + ".svg",
        name: "Example Sticker" + (id != -1 ? ` ${id}` : ""),
        description: "This is an example sticker!",
        physicalHeight: Math.random() * 10,
        physicalWidth: Math.random() * 10,
        tags: []
    };
}

/**
 * Get an empty sticker
 * 
 * @param [id=-1] The id of the sticker, defaults to -1 (ie. invalid)
 */
export function GetEmptySticker(): ILocalSticker {
    return {
        design: new File([], ""),
        name: "",
        description: "",
        physicalHeight: 0,
        physicalWidth: 0,
        tags: []
    };
}