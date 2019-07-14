import { IItem } from "./IItem";
import { ITicket } from "./ITicket";
import { IQuery } from "./IQuery";

export interface IItemData extends IQuery {
    value: string;
    item: IItem;
}
