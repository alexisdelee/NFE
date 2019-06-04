import { IQuery } from "./IQuery";

import { IUniversal } from "./IUniversal";
import { IItem } from "./IItem";
import { IItemData } from "./IItemData";
import { IItemOption } from "./IItemOption";

export interface IUniversalWrapper extends IQuery {
    universal: IUniversal;
    item: IItem;
    data: IItemData;
    options: Array<IItemOption>;
}
