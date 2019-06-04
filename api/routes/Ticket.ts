import * as express from "express";

import { unicornStuff } from "../decorators/wrapper";
import { TicketBusiness } from "../business/TicketBusiness";
import * as Model from "../entities/Ticket";
import { Datatype } from "../utils/Utils";
import { Success, cover } from "../utils/HttpWrapper";
import { Routing } from "../utils/middlewares/routing";

export class Ticket {
    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get("/" + Routing.build("ticketId", Routing.Validation.Id), this.findOne.bind(this));
        this.router.get("/:resource", this.findByResource.bind(this));
        this.router.get("/:resource/" + Routing.build("resourceId", Routing.Validation.Id), this.findByResource.bind(this));

        this.router.post("/", this.create.bind(this));
        this.router.post("/" + Routing.build("ticketId", Routing.Validation.Id) + "/archived", this.archive.bind(this));

        this.router.put("/" + Routing.build("ticketId", Routing.Validation.Id), this.update.bind(this));

        this.router.delete("/" + Routing.build("ticketId", Routing.Validation.Id), this.disable.bind(this));
    }

    @unicornStuff
    private *findOne(request: express.Request, response: express.Response): Datatype.Iterator.BiIterator<any> {
        const ticket: Model.Ticket = yield TicketBusiness.findOne(request.params.ticketId);

        response.status(Success.Ok).json(cover(ticket));
    }

    @unicornStuff
    private *findByResource(request: express.Request, response: express.Response): Datatype.Iterator.BiIterator<any> {
        const resourceId: number = request.params.resourceId === undefined ? null : request.params.resourceId;
        const tickets: Array<Model.Ticket> = yield TicketBusiness.findByResource(resourceId, request.params.resource);

        response.status(Success.Ok).json(cover(tickets));
    }

    @unicornStuff
    private *create(request: express.Request, response: express.Response): Datatype.Iterator.BiIterator<any> {
        yield new TicketBusiness(<Model.Ticket>request.body).create();

        response.status(Success.Ok).json(cover());
    }

    @unicornStuff
    private *update(request: express.Request, response: express.Response): Datatype.Iterator.BiIterator<any> {
        yield new TicketBusiness(<Model.Ticket>request.body).update(request.params.ticketId);

        response.status(Success.Ok).json(cover());
    }

    @unicornStuff
    private *archive(request: express.Request, response: express.Response): Datatype.Iterator.BiIterator<any> {
        yield TicketBusiness.archive(request.params.ticketId);

        response.status(Success.Ok).json(cover());
    }

    @unicornStuff
    private *disable(request: express.Request, response: express.Response): Datatype.Iterator.BiIterator<any> {
        yield TicketBusiness.disable(request.params.ticketId);

        response.status(Success.Ok).json(cover());
    }
}
