import { makeCoffee } from "../decorators/wrapper";
import { RegionRepository } from "../repositories/RegionRepository";
import { Region } from "../entities/Region";
import { Request } from "../utils/QueryWrapper";

export class RegionBusiness {
    constructor(public region: Region) {
    }

    @makeCoffee
    public static *find(region: Region): IterableIterator<any> {
        return yield new RegionRepository().find(region, Request.FetchType.Eager);
    }

    @makeCoffee
    public static *findOne(regionId: number): IterableIterator<any> {
        return yield new RegionRepository().findOne(regionId, Request.FetchType.Eager);
    }
}
