import { Backmap } from "./Utility";

/** Application unit systems */
const SYSTEM_TABLE = {
    metric: "centimeters",
    imperial: "inches"
} as const;
/** Application unit systems */
export type EUnitSystem = keyof typeof SYSTEM_TABLE;
/** Backmap lookup for the application unit system table */
const SYSTEM_TABLE_BACKMAP = Backmap(SYSTEM_TABLE);
/** Application units */
export type EUnit = keyof typeof SYSTEM_TABLE_BACKMAP

/** Application unit conversions */
const CONVERSION_TABLE: Readonly<Record<EUnit, Readonly<Record<EUnit, number>>>> = {
    centimeters: {
        centimeters: 1,
        inches: 0.393701
    },
    inches: {
        centimeters: 2.54,
        inches: 1
    }
};

/** The native application unit system */
export const NATIVE_SYSTEM: EUnitSystem = "metric";
/** The native application units */
export const NATIVE_UNITS: EUnit = SYSTEM_TABLE[NATIVE_SYSTEM];

/**
 * Convert a value from units to units
 */
export function Convert(value: number, from: EUnit, to: EUnit): number {
    if(from == to) return value;

    return value * CONVERSION_TABLE[from][to];
}

/**
 * Get the system that a unit belongs to
 */
export function GetSystemUnits(system: EUnitSystem): EUnit {
    return SYSTEM_TABLE[system];
}

/**
 * Get the unit that corresponds to a system
 */
export function GetUnitSystem(unit: EUnit): EUnitSystem {
    return SYSTEM_TABLE_BACKMAP[unit];
}

/**
 * Get all application unit systems
 */
export function GetUnitSystems(): EUnitSystem[] {
    return Object.keys(SYSTEM_TABLE) as EUnitSystem[];
}

/**
 * Get all application units
 */
export function GetUnits(): EUnit[] {
    return Object.keys(SYSTEM_TABLE_BACKMAP) as EUnit[];
}

/**
 * A value with a unit
 */
export class Unit {
    private value: number;

    /**
     * @param value The value of this object
     * @param unit The units that the object is in
     */
    constructor(value: number, unit: EUnit = NATIVE_UNITS) {
        this.value = Convert(value, unit, NATIVE_UNITS);
    }

    /**
     * Get the value in the specified units
     */
    public As(unit: EUnit): number {
        return Convert(this.value, NATIVE_UNITS, unit);
    }
}