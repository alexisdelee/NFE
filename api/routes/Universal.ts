import * as express from "express";

import { unicornStuff } from "../decorators/wrapper";
import { UniversalWrapperBusiness } from "../business/UniversalWrapperBusiness";
import * as Model from "../entities/UniversalWrapper";
import { Datatype } from "../utils/Utils";
import { Success, cover } from "../utils/HttpWrapper";
import { Routing } from "../utils/middlewares/routing";

export class Universal {
    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get("/ticket/" + Routing.build("ticketId", Routing.Validation.Id), this.findByTicket.bind(this));
    }

    @unicornStuff
    public *findByTicket(request: express.Request, response: express.Response): Datatype.Iterator.Iterator<any> {
        const tracker: Model.UniversalWrapper = yield UniversalWrapperBusiness.findByTicket(request.params.ticketId);

        response.status(Success.Ok).json(cover(tracker));
    }
}
