import type { Callback } from "../../Types";

export type ISticker = {
    id: number;
    name: string;
    designPath: string;
    physicalWidth: number;
    physicalHeight: number;
};

export const exampleSticker: Callback<ISticker> = () => ({
    id: -1,
    designPath: "",
    name: "Example",
    physicalHeight: 0,
    physicalWidth: 0
});