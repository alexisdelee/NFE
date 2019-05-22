import { Query } from "./Query";
import { Item } from "./Item";

export class ItemOption extends Query {
    public label: string;
    public value: string;
    public item: Item;
}
