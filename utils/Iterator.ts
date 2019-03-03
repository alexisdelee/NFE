/**
 * Use with for...of
 */
export function *Iterator(object: Object): IterableIterator<any> {
    const entries = Object.entries(object);
    for (let entry of entries) {
        yield entry;
    }
}
