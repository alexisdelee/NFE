import { ICategory } from "./ICategory";
import { IUniversal } from "./IUniversal";

export interface IStatus extends IUniversal {
    category: ICategory;
}
