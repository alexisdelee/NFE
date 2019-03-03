export interface IWrite<T> {
    create(item: T): IterableIterator<any>;
    update(id: number, item: T): IterableIterator<any>;
    delete(id: number): IterableIterator<any>;
    erase(id: number): IterableIterator<any>;
}
