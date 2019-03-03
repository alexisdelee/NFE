export interface IWrite<T> {
    create(item: T): IterableIterator<Promise<boolean>>;
    update(id: number, item: T): IterableIterator<Promise<boolean>>;
    delete(id: number): IterableIterator<Promise<boolean>>;
    erase(id: number): IterableIterator<Promise<boolean>>;
}
