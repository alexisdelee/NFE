import * as express from "express";

import { unicornStuff } from "../decorators/wrapper";
import { RegionBusiness } from "../business/RegionBusiness";
import * as Model from "../entities/Region";
import { Success, cover } from "../utils/HttpWrapper";
import { Routing } from "../utils/middlewares/routing";

export class Region {
    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get("/", this.find.bind(this));
        this.router.get("/" + Routing.build("regionId", Routing.Validation.Id), this.findOne.bind(this));
    }

    @unicornStuff
    public *find(request: express.Request, response: express.Response): IterableIterator<any> {
        const model: Model.Region = new Model.Region();
        model.postal = request.query.postal
        model.capital = request.query.capital;
        model.nccenr = request.query.nccenr;

        const regions: Array<Model.Region> = yield RegionBusiness.find(model);

        response.status(Success.Ok).json(cover(regions));
    }

    @unicornStuff
    public *findOne(request: express.Request, response: express.Response): IterableIterator<any> {
        const region: Model.Region = yield RegionBusiness.findOne(request.params.regionId);

        response.status(Success.Ok).json(cover(region));
    }
}
