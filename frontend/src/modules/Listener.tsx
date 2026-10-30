import type { Callback } from "../Types";

/**
 * A listener handle
 */
export type Handle = {
    /** Remove the listener */
    Remove: Callback;
};

/**
 * A listener, extend to use
 */
export default abstract class Listener {
    /** Bound listener handles */
    private bound: Map<number, Callback>;

    constructor() {
        this.bound = new Map();
    }

    /**
     * Add a listener
     * @param target What to do when the listener is triggered
     * @returns A handle for the listener
     */
    public AddListener(target: Callback): Handle {
        const id = Math.random();
        const handle = {Remove: () => this.bound.delete(id)};
        this.bound.set(id, target);
        return handle;
    }

    /**
     * Notify all bound listeners
     */
    protected NotifyListeners() {
        for(const target of this.bound.values()) {
            target();
        }
    }

    /**
     * Clear all bound listeners
     */
    protected ClearListeners() {
        this.bound.clear();
    }
}