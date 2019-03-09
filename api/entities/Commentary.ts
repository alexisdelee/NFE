import { Query } from "./Query";
import { Ticket } from "./Ticket";
import { User } from "./User";

export class Commentary extends Query {
    public description: string;
    public ticket: Ticket;
    public user: User;
}
