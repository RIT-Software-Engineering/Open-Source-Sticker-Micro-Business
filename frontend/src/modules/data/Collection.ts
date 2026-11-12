/**
 * Represents a collection
 */
export type ICollection = {
    /** The id of the collection */
    id: number;
    /** The name of the collection */
    name: string;
    /** THe members of the collection */
    stickers: Set<number>;
}