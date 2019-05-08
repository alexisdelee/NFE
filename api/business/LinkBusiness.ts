import { makeCoffee } from "../decorators/wrapper";
import { LinkRepository } from "../repositories/LinkRepository";
import { Link } from "../entities/Link";
import { Request } from "../utils/QueryWrapper";

export class LinkBusiness {
    constructor(public link: Link) {
    }

    @makeCoffee
    public static *find(link: Link): IterableIterator<any> {
        return yield new LinkRepository().find(link, Request.FetchType.Eager);
    }

    @makeCoffee
    public static *findOne(linkId: number): IterableIterator<any> {
        return yield new LinkRepository().findOne(linkId, Request.FetchType.Eager);
    }
}
