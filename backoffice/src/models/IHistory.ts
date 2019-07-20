import { IQuery } from "./IQuery";
import { IUser } from "./IUser";
import { ITicket } from "./ITicket";

export interface IHistory extends IQuery {
    category: string;
    label: string;
    previousValue: string;
    nextValue: string;
    user: IUser;
    ticket: ITicket;
}
