import { makeCoffee } from "../decorators/wrapper";
import { UniversalRepository } from "../repositories/UniversalRepository";
import { ItemRepository } from "../repositories/ItemRepository";
import { ItemDataRepository } from "../repositories/ItemDataRepository";
import { ItemOptionRepository } from "../repositories/ItemOptionRepository";
import { Item } from "../entities/Item";
import { ItemData } from "../entities/ItemData";
import { UniversalWrapper } from "../entities/UniversalWrapper";
import { Request } from "../utils/QueryWrapper";

export class UniversalWrapperBusiness {
    constructor(public wrapper: UniversalWrapper) {
    }

    @makeCoffee
    public static *findByTicket(ticketId: number): IterableIterator<any> {
        const wrappers = new Array<UniversalWrapper>();

        const data: Array<ItemData> = yield new ItemDataRepository().findByTicket(ticketId, Request.FetchType.Lazy);
        for (const d of data) {
            const item: Item = yield new ItemRepository().findOne(d.item.id, Request.FetchType.Lazy);

            const wrapper: UniversalWrapper = <UniversalWrapper>{
                data: d,
                item,
                universal: yield new UniversalRepository().findOne(item.universal.id, Request.FetchType.Lazy),
                options: yield new ItemOptionRepository().findByItem(item.id, Request.FetchType.Lazy)
            };

            wrappers.push(wrapper);
        }

        return wrappers;
    }
}
