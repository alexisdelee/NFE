import { Query } from "./Query";
import { Link } from "./Link";
import { Ticket } from "./Ticket";

export class LinkTicket extends Query {
    public link: Link;
    public outward: Ticket;
    public inward: Ticket;
}
