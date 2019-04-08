import { Query } from "../../utils/QueryWrapper";
import { Datatype } from "../../utils/Utils";

export interface IRead<T> {
    find(item: T): Datatype.Iterator.BiIterator<Query>;
    findOne(id: number): Datatype.Iterator.BiIterator<Query>;
}
