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
