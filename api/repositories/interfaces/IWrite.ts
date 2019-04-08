import { Query } from "../../utils/QueryWrapper";
import { Datatype } from "../../utils/Utils";

export interface IWrite<T> {
    create(item: T): Datatype.Iterator.BiIterator<Query>;
    update(id: number, item: T): Datatype.Iterator.BiIterator<Query>;
    delete(id: number): Datatype.Iterator.BiIterator<Query>;
    erase(id: number): Datatype.Iterator.BiIterator<Query>;
}
