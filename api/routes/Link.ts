import * as express from "express";
import { JsonConvert, ValueCheckingMode } from "json2typescript/index";

import { unicornStuff } from "../decorators/wrapper";
import { LinkBusiness } from "../business/LinkBusiness";
import * as Model from "../entities/Link";
import { Datatype } from "../utils/Utils";
import { Success, cover } from "../utils/HttpWrapper";
import { Routing } from "../utils/middlewares/routing";

export class Link {
    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get("/", this.find.bind(this));
        this.router.get("/" + Routing.build("linkId", Routing.Validation.Id), this.findOne.bind(this));
        
        this.router.post("/", this.create.bind(this));
    }

    @unicornStuff
    public *find(request: express.Request, response: express.Response): Datatype.Iterator.Iterator<any> {
        const model: Model.Link = new Model.Link();
        model.outward = request.query.outward;
        model.inward = request.query.inward;

        const links: Array<Model.Link> = yield LinkBusiness.find(model);

        response.status(Success.Ok).json(cover(links));
    }

    @unicornStuff
    public *findOne(request: express.Request, response: express.Response): Datatype.Iterator.Iterator<any> {
        const link: Model.Link = yield LinkBusiness.findOne(request.params.linkId);

        response.status(Success.Ok).json(cover(link));
    }

    @unicornStuff
    public *create(request: express.Request, response: express.Response): Datatype.Iterator.Iterator<any> {
        try {        
            const jsonConvert: JsonConvert = new JsonConvert();
            jsonConvert.ignorePrimitiveChecks = false;
            jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

            const link: Model.Link = jsonConvert.deserializeObject(request.body, Model.Link);
            console.log(link);
        } catch(err) {
            console.error(err);
        }
    }
}
