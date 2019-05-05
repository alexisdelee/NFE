import * as express from "express";

import { unicornStuff } from "../decorators/wrapper";
import { StatusBusiness } from "../business/StatusBusiness";
import * as Model from "../entities/Status";
import { Success, cover } from "../utils/HttpWrapper";
import { Routing } from "../utils/middlewares/routing";

export class Status {
    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get("/", this.find.bind(this));
        this.router.get("/" + Routing.build("statusId", Routing.Validation.Id), this.findOne.bind(this));
    }

    @unicornStuff
    public *find(request: express.Request, response: express.Response): IterableIterator<any> {
        const model: Model.Status = new Model.Status();
        model.name = request.query.name
        model.shortname = request.query.shortname;

        const status: Array<Model.Status> = yield StatusBusiness.find(model);

        response.status(Success.Ok).json(cover(status));
    }

    @unicornStuff
    public *findOne(request: express.Request, response: express.Response): IterableIterator<any> {
        const status: Model.Status = yield StatusBusiness.findOne(request.params.statusId);

        response.status(Success.Ok).json(cover(status));
    }
}
