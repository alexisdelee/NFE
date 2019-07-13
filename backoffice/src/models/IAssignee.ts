import { IQuery } from "./IQuery";
import { IUser } from "./IUser";
import { ITicket } from "./ITicket";

export interface IAssignee extends IQuery {
    user: IUser;
    ticket: ITicket;
}
