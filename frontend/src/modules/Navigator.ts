import { useState } from "react";
import Listener from "./Listener";
import { useRerender } from "./Utility";

class Frame {
    private name: string;
    public state: Record<string, unknown>;

    constructor(name: string) {
        this.name = name;
        this.state = {};
    }

    public get Name(): string {
        return this.name;
    }
}

export default class Navigator extends Listener {
    private head: number;
    private history: Frame[];

    constructor(start: string) {
        super();

        this.head = 0;
        this.history = [new Frame(start)];
    }

    public To(page: string): void {
        this.history = this.history.slice(0, this.head + 1);
        this.history.push(new Frame(page));
        this.head++;
        this.NotifyListeners();
    }

    public Back(): void {
        if(this.head > 0) {
            this.head--;
            this.NotifyListeners();
        }
    }

    private get Frame(): Frame {
        return this.history[this.head];
    }

    public get Name(): string {
        return this.Frame.Name;
    }

    public get State(): Record<string, unknown> {
        return this.Frame.state;
    }

    public set State(value: Record<string, unknown>) {
        this.Frame.state = value;
    }
}

export function useNavigator(splash: string): Navigator {
    const rerender = useRerender();
    const navigator = useState(new Navigator(splash))[0];

    navigator.AddListener(() => rerender("Navigated"));

    return navigator;
}

export type INavigableProps = {
    nav: Navigator;
}