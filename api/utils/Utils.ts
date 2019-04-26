import * as crypto from "crypto";

export namespace Datatype {
    export namespace Function {
        // represents an operation that accepts two input arguments and returns no result
        // export type BiConsumer<T, U> = (value: T, other: U) => void;
        export type BiConsumer<T, U> = BiFunction<T, U, void>;

        // represents a function that accepts two arguments and produces a result
        export type BiFunction<T, U, R> = (value: T, other: U) => R;

        // represents an operation upon two operands of the same type, producing a result of the same type as the operands
        // export type BinaryOperator<T> = (value: T, other: T) => T;
        export type BinaryOperator<T> = BiFunction<T, T, T>;

        // represents a predicate (boolean-valued function) of two arguments
        // export type BiPredicate<T, U> = (value: T, other: T) => U;
        export type BiPredicate<T, U> = BiFunction<T, T, U>;

        // represents an operation that accepts a single input argument and returns no result
        // export type Consumer<T> = (value: T) => any
        export type Consumer<T> = Function<T, any>;

        // represents a function that accepts one argument and produces a result
        export type Function<T, R> = (value: T) => R;

        // represents a predicate (boolean-valued function) of one argument
        // export type Predicate<T> = (value: T) => boolean;
        export type Predicate<T> = Function<T, boolean>;

        // represents a supplier of results
        export type Supplier<R> = () => R;

        // represents an operation on a single operand that produces a result of the same type as its operand
        // export type UnaryOperator<T> = (value: T) => T;
        export type UnaryOperator<T> = Function<T, T>;
    }

    export namespace Iterator {
        // export type BiIterator<T> = IterableIterator<IterableIterator<T>>
        export type BiIterator<T> = Iterator<Iterator<T>>;
        
        export type Iterator<T> = IterableIterator<T>;
    }

    export type Primitive = string | number | boolean | null | undefined;

    export function SafeCast<T>(value: any): T {
        return <T>(<unknown>value);
    }
}

export function bound(min, max, value) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Use with for...of
 * example: for (const [ property, value ] of Iterator({ a: 1, b: 2 })) {}
 */
export function *Iterator(object: Object): IterableIterator<any> {
    const entries = Object.entries(object);
    for (let entry of entries) {
        yield entry;
    }
}

export namespace Crypto {
    export type HashInfo = {
        name: string,
        keylen: number,
        iterations: number
    };

    export function getDefaultHashInfo(): HashInfo {
        return {
            name: "sha512",
            keylen: 64,
            iterations: 100000
        };
    }

    export function createHash(data: string, algo: string): string {
        if (!crypto.getHashes().includes(algo)) {
            throw new Error("the hash algorithm is not recognized");
        }

        return crypto.createHash(algo).update(data).digest("hex");
    }

    export function createPbkdf2(data: string, salt: string, algo: string, keylen: number, iterations: number): string {
        if (!crypto.getHashes().includes(algo)) {
            throw new Error("the hash algorithm is not recognized");
        }

        return crypto.pbkdf2Sync(data, salt, iterations, keylen, algo).toString("hex");
    }
}

export namespace Format {
    export enum Time {
        millisecond = "ms",
        second      = "s",
        minute      = "m",
        hour        = "h",
        day         = "d",
        year        = "y"
    }
}
