declare namespace Q {
    export function spawn<T>(generatorFunction: any): (...args: any[]) => Promise<T>;
}
