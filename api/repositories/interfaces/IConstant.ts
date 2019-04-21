import { Query, Request } from "../../utils/QueryWrapper";
import { Datatype } from "../../utils/Utils";

export interface IConstant {
    findBySynchro(label: string, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query>;
}
