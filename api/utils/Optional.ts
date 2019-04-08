import { Datatype } from "./Utils";

export class Optional<T> {
    constructor(public readonly value: T) {
    }

    // if a value is present, and the value matches the given predicate, return an Optional describing the value, otherwise return an empty Optional
    public filter(predicate: Datatype.Function.Predicate<T>): Optional<T> {
        return predicate(this.value) ? Optional.of(this.value) : Optional.empty();
    }

    // if a value is present, apply the provided mapping function to it, and if the result is non-null, return an Optional describing the result
    public map<R>(mapper: Datatype.Function.Function<T, R>): Optional<R> {
        if (this.isPresent()) {
            return Optional.of(mapper(this.value));
        } else {
            return Optional.empty();
        }
    }

    // if a value is present, apply the provided Optional-bearing mapping function to it, return that result, otherwise return an empty Optional
    public flatMap<R>(mapper: Datatype.Function.Function<T, Optional<R>>): Optional<R> {
        if (this.isPresent()) {
            return mapper(this.value);
        } else {
            return Optional.empty();
        }
    }

    // return false if there is a value present, otherwise true
    public isEmpty(): boolean {
        return this.value === undefined || this.value === null;
    }

    // return true if there is a value present, otherwise false
    public isPresent(): boolean {
        return !this.isEmpty();
    }

    // if a value is present, invoke the specified consumer with the value, otherwise do nothing
    public ifPresent(consumer: Datatype.Function.Consumer<T>): void {
        if (this.isPresent()) {
            consumer(this.value);
        }
    }

    // if a value is present, performs the given action with the value, otherwise performs the given empty-based action
    public ifPresentOrElse(action: Datatype.Function.Consumer<T>, emptyAction: Datatype.Function.Supplier<any>): void {
        if (this.isPresent()) {
            action(this.value);
        } else {
            emptyAction();
        }
    }

    // if a value is present, returns an Optional describing the value, otherwise returns an Optional produced by the supplying function
    public or(supplier: Datatype.Function.Supplier<Optional<T>>): Optional<T> {
        return this.isPresent() ? this : supplier();
    }

    // return the value if present, otherwise return other
    public orElse(other: T): T {
        return this.isPresent() ? this.value : other;
    }

    // return the value if present, otherwise invoke other and return the result of that invocation
    public orElseGet(other: Datatype.Function.Supplier<T>): T {
        return this.isPresent() ? this.value : other();
    }

    // return the contained value, if present, otherwise throw an exception to be created by the provided supplier
    public orElseThrow<R>(exceptionSupplier: Datatype.Function.Supplier<R>): T {
        if (this.isPresent()) {
            return this.value;
        }

        throw exceptionSupplier();
    }

    // returns a non-empty string representation of this Optional suitable for debugging
    public toString(): string {
        if (this.isPresent()) {
            return "Optional[" + this.value + "]";
        } else {
            return "Optional.empty";
        }
    }

    // returns an Optional with the specified present non-null value
    public static of<T>(value: T): Optional<T> {
        return new Optional(value);
    }

    public static empty(): Optional<null> {
        return Optional.of(null);
    }
}
