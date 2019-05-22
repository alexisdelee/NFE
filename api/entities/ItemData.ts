import { Query } from "./Query";
import { Item } from "./Item";
import { Ticket } from "./Ticket";

export class ItemData extends Query {
    public value: string;
    public item: Item;
    public ticket: Ticket;
    public deleted: boolean;
}
