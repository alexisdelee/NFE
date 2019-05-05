import * as express from "express";

import { unicornStuff } from "../decorators/wrapper";
import { CategoryBusiness } from "../business/CategoryBusiness";
import * as Model from "../entities/Category";
import { Success, cover } from "../utils/HttpWrapper";
import { Routing } from "../utils/middlewares/routing";

export class Category {
    public router: express.Router;

    constructor() {
        this.router = express.Router();

        this.router.get("/", this.find.bind(this));
        this.router.get("/" + Routing.build("categoryId", Routing.Validation.Id), this.findOne.bind(this));
    }

    @unicornStuff
    public *find(request: express.Request, response: express.Response): IterableIterator<any> {
        const model: Model.Category = new Model.Category();
        model.name = request.query.name
        model.shortname = request.query.shortname;

        const categories: Array<Model.Category> = yield CategoryBusiness.find(model);

        response.status(Success.Ok).json(cover(categories));
    }

    @unicornStuff
    public *findOne(request: express.Request, response: express.Response): IterableIterator<any> {
        const category: Model.Category = yield CategoryBusiness.findOne(request.params.categoryId);

        response.status(Success.Ok).json(cover(category));
    }
}
