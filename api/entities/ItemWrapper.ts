import { Query } from "./Query";
import { Universal } from "./Universal";
import { Item } from "./Item";
import { ItemData } from "./ItemData";
import { ItemOption } from "./ItemOption";

export class ItemWrapper extends Query {
    public universal: Universal;
    public item: Item;
    public data: ItemData;
    public options: Array<ItemOption>;
}
