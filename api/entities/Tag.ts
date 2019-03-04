import { Query } from "./Query";
import { User } from "./User";
import { Ticket } from "./Ticket";

export class Tag extends Query {
    public name: string;
    public privateUser: User;
    public ticket: Ticket;
    public user: User;
}
