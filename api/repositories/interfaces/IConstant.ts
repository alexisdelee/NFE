import { Query } from "../../utils/QueryWrapper";
import { Datatype } from "../../utils/Utils";

export interface IConstant {
    findBySynchro(label: string): Datatype.Iterator.BiIterator<Query>;
}
