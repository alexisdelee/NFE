import { Query } from "./Query";
import { Tracker } from "./Tracker";
import { Universal } from "./Universal";

export class Item extends Query {
    public label: string;
    public readonly: boolean;
    public required: boolean;
    public tracker: Tracker;
    public universal: Universal;
}
