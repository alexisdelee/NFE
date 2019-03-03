export interface IRead<T> {
    find(item: T): IterableIterator<Promise<T>>;
    findOne(id: number): IterableIterator<Promise<T>>;
}
