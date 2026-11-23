import { createContext, useContext } from "react";
import type { EUnitSystem } from "./Units";

/**
 * Represents a user (partially a placeholder)
 */
export default class User {
    private _isAdmin: boolean;
    private _name: string;

    /** The user's unit system */
    public unitSystem: EUnitSystem;

    constructor() {
        this._isAdmin = true;
        this._name = "Admin";
        this.unitSystem = "imperial";
    }

    /** Is the user an admin */
    public get isAdmin(): boolean {
        return this._isAdmin;
    }

    /** The user's name */
    public get name(): string {
        return this._name;
    }
}

/**
 * Provide user context
 */
export const UserContext = createContext<User | null>(null);

/**
 * Use the current user
 */
export function useUser(): User | null {
    return useContext(UserContext);
}