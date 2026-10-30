import type { Callback } from "../Types";

/**
 * A listener handle
 */
export type Handle = Readonly<{
    /** Remove the listener */
    Remove: Callback;
    /** The id of the listener */
    id: number;
}>;

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
     * Remove a listener
     * @param id The listener to remove
     */
    protected RemoveListener(id: number) {
        this.bound.delete(id);
    }

    /**
     * Add a listener
     * @param target What to do when the listener is triggered
     * @returns A handle for the listener
     */
    public AddListener(target: Callback): Handle {
        const id = Math.random();
        const handle = Object.freeze({
            Remove: () => this.RemoveListener(id),
            id: id
        });
        this.bound.set(id, target);
        return handle;
    }

    /**
     * Notify a listener
     * @param id The listener to notify
     */
    protected NotifyListener(id: number) {
        const target = this.bound.get(id);
        if(target != null) target();
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

    protected get BoundListeners(): MapIterator<number> {
        return this.bound.keys();
    }

    protected get ListenerCount(): number {
        return this.bound.size;
    }
}