import { ITracker } from "./ITracker";
import { IUniversal } from "./IUniversal";
import { IQuery } from "./IQuery";

export interface IItem extends IQuery {
    label: string;
    readonly: boolean;
    required: boolean;
    tracker: ITracker;
    universal: IUniversal;
}
