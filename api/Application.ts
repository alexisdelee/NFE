import * as express from "express";
import { json, urlencoded } from "body-parser";
import * as helmet from "helmet";

import { HttpError, ServerError } from "./utils/HttpWrapper";

class Application {
    public static readonly datatypes: Array<string> = ["application/json", "application/x-www-form-urlencoded"];
    public application: express.Application;

    constructor() {
        // create express js application
        this.application = express();

        this.application.use((error: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
            try {
                if (!request.headers["Content-Type"]) {
                    throw new HttpError(ServerError.InternalServerError, "missing content type");
                } else if (!Application.datatypes.includes(<string>request.headers["Content-Type"])) {
                    throw new HttpError(ServerError.InternalServerError, "only thoses formats are currently supported: " + Application.datatypes.join(", "));
                }

                next();
            } catch(err) {
                response.status(err.code).json({ errors: [ err.message ]});
            }
        });

        // configure application
        this.config();

        // configure routes
        this.routes();
    }

    private config(): void {
        // support application/json type post data
        this.application.use(json());

        // support application/x-www-form-urlencoded post data
        this.application.use(urlencoded({ extended: true }));

        // help secure express app with various http headers
        this.application.use(helmet());
    }

    private routes(): void {
        // use router middleware
    }
}

export default new Application().application;
