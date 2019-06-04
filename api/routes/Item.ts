import * as express from "express";

import { unicornStuff } from "../decorators/wrapper";
import { ItemWrapperBusiness } from "../business/ItemWrapperBusiness";
import * as Model from "../entities/ItemWrapper";
import { Datatype } from "../utils/Utils";
import { Success, cover } from "../utils/HttpWrapper";
import { Routing } from "../utils/middlewares/routing";

export class Item {
    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get("/ticket/" + Routing.build("ticketId", Routing.Validation.Id), this.findByTicket.bind(this));
        this.router.get("/tracker/" + Routing.build("trackerId", Routing.Validation.Id), this.findByTracker.bind(this));

        this.router.put("/ticket/" + Routing.build("ticketId", Routing.Validation.Id), this.updateByTicket.bind(this));
    }

    @unicornStuff
    public *findByTicket(request: express.Request, response: express.Response): Datatype.Iterator.BiIterator<any> {
        const tracker: Model.ItemWrapper = yield ItemWrapperBusiness.findByTicket(request.params.ticketId);

        response.status(Success.Ok).json(cover(tracker));
    }

    @unicornStuff
    public *findByTracker(request: express.Request, response: express.Response): Datatype.Iterator.BiIterator<any> {
        const tracker: Model.ItemWrapper = yield ItemWrapperBusiness.findByTracker(request.params.trackerId);

        response.status(Success.Ok).json(cover(tracker));
    }

    @unicornStuff
    public *updateByTicket(request: express.Request, response: express.Response): Datatype.Iterator.BiIterator<any> {
        yield ItemWrapperBusiness.updateByTicket(request.body);

        response.status(Success.Ok).json(cover());
    }
}
