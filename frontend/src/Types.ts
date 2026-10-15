export type Callback<T = unknown> = () => T;
export type StateRef<T> = (value: T) => unknown;