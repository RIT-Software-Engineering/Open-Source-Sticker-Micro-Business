import type { Callback } from "../../Types";

export type ISticker = {
    id: number;
    name: string;
    description: string;
    designPath: string;
    physicalWidth: number;
    physicalHeight: number;
};

export const exampleSticker: Callback<ISticker> = () => ({
    id: -1,
    designPath: "",
    name: "Example",
    description: "This is an example sticker!",
    physicalHeight: 0,
    physicalWidth: 0
});