import type { Callback } from "../Types";

export type Handle = {Remove: Callback};

export default abstract class Listener {
    private bound: Map<number, Callback>;

    constructor() {
        this.bound = new Map();
    }

    public AddListener(target: Callback): Handle {
        const id = Math.random();
        const handle = {Remove: () => this.bound.delete(id)};
        this.bound.set(id, target);
        return handle;
    }

    protected NotifyListeners() {
        for(const target of this.bound.values()) {
            target();
        }
    }

    protected ClearListeners() {
        this.bound.clear();
    }
}