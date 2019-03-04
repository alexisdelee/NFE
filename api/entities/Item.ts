import { Query } from "./Query";
import { Tracker } from "./Tracker";
import { Universal } from "./Universal";

export class Item extends Query {
    public label: string;
    public selectField: string;
    public updateField: string;
    public sorting: number;
    public tracker: Tracker;
    public universal: Universal;
}
