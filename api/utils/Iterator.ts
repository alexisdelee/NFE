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
