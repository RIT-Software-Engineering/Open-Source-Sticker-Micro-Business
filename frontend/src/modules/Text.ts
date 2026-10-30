import en from "../../lang/en.json";
import type { DeepReadonly } from "./Types";

export default function useText(): DeepReadonly<typeof en> {
    return en;
}