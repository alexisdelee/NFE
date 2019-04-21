import { makeCoffee } from "../decorators/wrapper";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { Category } from "../entities/Category";
import { Request } from "../utils/QueryWrapper";

export class CategoryData {
    constructor(
        public readonly latest: Category,
        public readonly wip: Category,
        public readonly done: Category,
        public readonly solution: Category
    ) {
    }

    @makeCoffee
    public static *create(): IterableIterator<any> {
        return new CategoryData(
            <Category>(yield new CategoryRepository().findBySynchro("new", Request.FetchType.Eager)),
            <Category>(yield new CategoryRepository().findBySynchro("wip", Request.FetchType.Eager)),
            <Category>(yield new CategoryRepository().findBySynchro("done", Request.FetchType.Eager)),
            <Category>(yield new CategoryRepository().findBySynchro("solution", Request.FetchType.Eager))
        );
    }
}
