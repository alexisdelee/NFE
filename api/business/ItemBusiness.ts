import { makeCoffee } from "../decorators/wrapper";
import { ItemRepository } from "../repositories/ItemRepository";
import { ItemOptionRepository } from "../repositories/ItemOptionRepository";
import { Item } from "../entities/Item";
import { ItemOption } from "../entities/ItemOption";
import { Universal } from "entities/Universal";
import { Datatype } from "../utils/Utils";
import { Request } from "../utils/QueryWrapper";

export class itemBusiness {
    constructor(public item: Item) {
    }

    @makeCoffee
    public *create(): Datatype.Iterator.BiIterator<any> {
        yield new ItemRepository().create(this.item);
    }

    @makeCoffee
    public *addOption(option: ItemOption): Datatype.Iterator.BiIterator<any> {
        option.item = this.item;
        yield new ItemOptionRepository().create(option);
    }
}
