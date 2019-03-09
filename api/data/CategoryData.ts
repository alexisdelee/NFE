import { makecoffee } from "../decorators/wrapper";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { Category } from "../entities/Category";

export class CategoryData {
    constructor(
        public readonly latest: Category,
        public readonly wip: Category,
        public readonly done: Category,
        public readonly solution: Category
    ) {
    }

    @makecoffee
    public static *create(): IterableIterator<any> {
        return new CategoryData(
            <Category>(yield new CategoryRepository().findBySynchro("new")),
            <Category>(yield new CategoryRepository().findBySynchro("wip")),
            <Category>(yield new CategoryRepository().findBySynchro("done")),
            <Category>(yield new CategoryRepository().findBySynchro("solution"))
        );
    }
}
