import en from "../../lang/en.json";
import type { DeepReadonly } from "./Types";

export default function useText(): DeepReadonly<Omit<typeof en, "$name" | "$desc">> {
    return en;
}

export function TemplateText(asset: string, ...args: string[]): string {
    for(let i = 0; i < args.length; i++) {
        asset = asset.replace("$".padEnd(7, i.toString()), args[i]);
    } return asset;
}