import { useCallback } from "react";
import useText from "./Text";

/**
 * An input validator
 */
export type Validator = (query: string) => string | null | undefined | void;

/**
 * Create a validator for text length > 0
 */
export function useLengthValidator(): Validator {
    const text = useText();

    return useCallback((query: string): string | null | undefined | void => {
        if(query.length == 0) return text.generic.validation.badLength;
    }, [text]);
}

/**
 * Create a validator for number values  
 * Inherits LengthValidator
 */
export function useNumberValidator(): Validator {
    const text = useText();
    const LengthValidator = useLengthValidator();

    return useCallback((query: string): string | null | undefined | void => {
        const check = LengthValidator(query);
        if((check ?? "").length > 0) return check;

        const value = Number.parseFloat(query);

        if(Number.isNaN(value)) return text.generic.validation.badNumber;
    }, [text, LengthValidator]);
}

/**
 * Create a validator for number value > 0  
 * Inherits NumberValidator
 */
export function usePositiveValidator(): Validator {
    const text = useText();
    const NumberValidator = useNumberValidator();

    return useCallback((query: string): string | null | undefined | void => {
        const check = NumberValidator(query);
        if((check ?? "").length > 0) return check;

        const value = Number.parseFloat(query);

        if(value <= 0) return text.generic.validation.needsPositive;
    }, [text, NumberValidator]);
}