import { Query, Request } from "../../utils/QueryWrapper";
import { Datatype } from "../../utils/Utils";

export interface IRead<T> {
    find(item: T, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query>;
    findOne(id: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query>;
}
