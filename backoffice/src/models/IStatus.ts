import { ICategory } from "./ICategory";
import { IGeneric } from "./IGeneric";

export interface IStatus extends IGeneric {
    category: ICategory;
}
