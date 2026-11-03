import { createContext, useContext } from "react";

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

export const UserContext = createContext<User | null>(null);

export function useUser(): User | null {
    return useContext(UserContext);
}