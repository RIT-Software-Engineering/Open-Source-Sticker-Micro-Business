import { createContext, useContext } from "react";

/**
 * Represents a user (partially a placeholder)
 */
export default class User {
    private _isAdmin: boolean;
    private _name: string

    constructor() {
        this._isAdmin = true;
        this._name = "Admin"
    }

    public get IsAdmin(): boolean {
        return this._isAdmin;
    }

    public get Name(): string {
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