import type { CSSProperties, ReactNode } from "react";

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

/**
 * Type an object as deep frozen
 */
export type DeepReadonly<T> =
    T extends any[] ? DeepReadonlyArray<T[number]> :
    T extends object ? DeepReadonlyObject<T> :
    T;

/**
 * Special JSON names
 */
export type ReservedJsonNames = "$name" | "$desc";

/**
 * Props extender for components that support styling
 */
export type ISupportsStyle<T = CSSProperties> = {
    style?    : T | undefined;
    className?: string | undefined;
}

/**
 * Props extender for components that support children
 */
export type ISupportsChildren<T = ReactNode> = {
    children?: T | undefined;
}