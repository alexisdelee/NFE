import { makeCoffee } from "../decorators/wrapper";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { Category } from "../entities/Category";
import { Request } from "../utils/QueryWrapper";

export class CategoryBusiness {
    constructor(public category: Category) {
    }

    @makeCoffee
    public static *find(category: Category): IterableIterator<any> {
        return yield new CategoryRepository().find(category, Request.FetchType.Eager);
    }

    @makeCoffee
    public static *findOne(categoryId: number): IterableIterator<any> {
        return yield new CategoryRepository().findOne(categoryId, Request.FetchType.Eager);
    }
}
