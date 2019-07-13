import { IQuery } from "./IQuery";
import { ITicket } from "./ITicket";
import { ILink } from "./ILink";

export interface ILinkTicket extends IQuery {
    link: ILink;
    referent: ITicket;
    reference: ITicket;
}
