import type { DeepReadonly } from "./modules/Types";

const config = {
    navbar: {
        collapseWidth: 600 // The minimum uncollapsed width of the navbar
    }
}

export type IConfig = typeof config;

/**
 * Use the application config  
 * Stubbed hook
 */
export default function useConfig(): DeepReadonly<IConfig> {
    return config;
}