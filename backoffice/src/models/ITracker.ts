import { IGeneric } from "./IGeneric";
import { IResource } from "./IResource";

export interface ITracker extends IGeneric {
    name: string;
    shortname: string;
    description: string;
    icon: IResource;
}
