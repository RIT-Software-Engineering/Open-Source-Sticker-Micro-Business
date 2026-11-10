import type { DeepReadonly } from "./modules/Types";

const config = {
    shop: {
        maxShortDescriptionLength: 100 // The maximum description length that can be shown without truncation on a sticker card
    },
    borderRadius                 : 4,  // The application boder radius (border radius is not inherited apparently and you can't apply it to all elements)
    mobileWidthCutoffPx          : 600 // Screens thinner than this are assumed to be mobile
}

export type IConfig = typeof config;

/**
 * Use the application config  
 * Stubbed hook
 */
export default function useConfig(): DeepReadonly<IConfig> {
    return config;
}