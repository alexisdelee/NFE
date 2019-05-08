import * as express from "express";

import { unicornStuff } from "../decorators/wrapper";
import { PriorityBusiness } from "../business/PriorityBusiness";
import * as Model from "../entities/Priority";
import { Datatype } from "../utils/Utils";
import { Success, cover } from "../utils/HttpWrapper";
import { Routing } from "../utils/middlewares/routing";

export class Priority {
    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get("/", this.find.bind(this));
        this.router.get("/" + Routing.build("priorityId", Routing.Validation.Id), this.findOne.bind(this));
    }

    @unicornStuff
    public *find(request: express.Request, response: express.Response): Datatype.Iterator.Iterator<any> {
        const model: Model.Priority = new Model.Priority();
        model.name = request.query.name;
        model.shortname = request.query.shortname;

        const priorities: Array<Model.Priority> = yield PriorityBusiness.find(model);

        response.status(Success.Ok).json(cover(priorities));
    }

    @unicornStuff
    public *findOne(request: express.Request, response: express.Response): Datatype.Iterator.Iterator<any> {
        const priority: Model.Priority = yield PriorityBusiness.findOne(request.params.priorityId);

        response.status(Success.Ok).json(cover(priority));
    }
}
