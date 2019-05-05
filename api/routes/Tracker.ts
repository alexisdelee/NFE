import * as express from "express";

import { unicornStuff } from "../decorators/wrapper";
import { TrackerBusiness } from "../business/TrackerBusiness";
import * as Model from "../entities/Tracker";
import { Success, cover } from "../utils/HttpWrapper";
import { Routing } from "../utils/middlewares/routing";

export class Tracker {
    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get("/", this.find.bind(this));
        this.router.get("/" + Routing.build("trackerId", Routing.Validation.Id), this.findOne.bind(this));
    }

    @unicornStuff
    public *find(request: express.Request, response: express.Response): IterableIterator<any> {
        const model: Model.Tracker = new Model.Tracker();
        model.name = request.query.name
        model.shortname = request.query.shortname;

        const trackers: Array<Model.Tracker> = yield TrackerBusiness.find(model);

        response.status(Success.Ok).json(cover(trackers));
    }

    @unicornStuff
    public *findOne(request: express.Request, response: express.Response): IterableIterator<any> {
        const tracker: Model.Tracker = yield TrackerBusiness.findOne(request.params.trackerId);

        response.status(Success.Ok).json(cover(tracker));
    }
}
