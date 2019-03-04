import { Query } from "./Query";
import { Category } from "./Category";

export class Status extends Query {
    public name: string;
    public shortname: string;
    public description: string;
    public category: Category;
}
