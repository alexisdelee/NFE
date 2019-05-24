import { IItem } from "./IItem";
import { IQuery } from "./IQuery";

export interface IItemOption extends IQuery {
    label: string;
    value: string;
    item: IItem;
}
