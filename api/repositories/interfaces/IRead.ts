export interface IRead<T> {
    find(item: T): IterableIterator<any>;
    findOne(id: number): IterableIterator<any>;
}
