import { useCallback, useState } from "react";
import type { StateRef } from "../Types";

/** The cache name of the user's local state */
const CACHE_LOCATION = "local-user";

/**
 * Local state for the user
 */
export interface LocalUser {

}

/** The default value for the user's local state */
const defaultLocalUser: LocalUser = {

}

/**
 * Use local state for the user
 */
export function useLocal(): [LocalUser, StateRef<LocalUser>] {
    const [state, _setState] = useState<LocalUser>(() => JSON.parse(window.localStorage.getItem(CACHE_LOCATION) ?? JSON.stringify(defaultLocalUser)));

    const setState = useCallback((state: LocalUser) => {
        window.localStorage.setItem(CACHE_LOCATION, JSON.stringify(state));
        _setState(state);
    }, [_setState]);

    return [state, setState];
}