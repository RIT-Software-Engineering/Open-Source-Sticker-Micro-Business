import type { ISticker } from "./Sticker";

/**
 * Represents a staged sticker
 */
export default interface IStagedItem {
    sticker : ISticker;
    quantity: number;
}