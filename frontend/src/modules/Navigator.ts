import { useState } from "react";
import Listener from "./Listener";
import { useRerender } from "./Utility";

class Link {
    private _path: string[];
    private _params: Map<string, string>

    constructor(path: string[] = [], params: Map<string, string> = new Map()) {
        this._path = path;
        this._params = new Map(params);
    }

    public get path(): string[] {
        return [...this._path];
    }

    public get params(): Map<string, string> {
        return new Map(this._params)
    }
}

export default class Navigator extends Listener {
    private head: number;
    private history: Link[];

    constructor(path: string[] = [], params: Map<string, string> = new Map()) {
        super();

        this.head = 0;
        this.history = [new Link(path, params)];
    }

    public To(path: string[] = [], params: Map<string, string> = new Map()): void {
        this.history = this.history.slice(0, this.head + 1);
        this.history.push(new Link(path, params));
        this.head++;
        this.NotifyListeners();
    }

    public Back(): void {
        if(this.head > 0) {
            this.head--;
            this.NotifyListeners();
        }
    }

    public get current(): Link {
        return this.history[this.head];
    }
}

export function useNavigator(splash: string[]): Navigator {
    const rerender = useRerender();
    const navigator = useState(new Navigator(splash))[0];

    navigator.AddListener(() => rerender("Navigated"));

    return navigator;
}

export type INavigableProps = {
    nav: Navigator;
}