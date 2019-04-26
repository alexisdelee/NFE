import * as express from "express";
import * as Q from "q";

import webconfig from "../webconfig";
import application from "./Application";
import { HttpError, ServerError } from "./utils/HttpWrapper";
import { GlobalData } from "./data/GlobalData";

application.use((error: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
        if (error) {
            if (error instanceof SyntaxError) {
                throw new HttpError(ServerError.InternalServerError, "invalid json synthax");
            }

            throw new HttpError(ServerError.InternalServerError, error.message ? error.message : "internal error");
        }
    } catch(err) {
        response.status(err.code).json({ errors: [ err.message ] });
    }
});

application.listen(webconfig.api.port, Q.async(function *() {
    yield GlobalData.boot();
    console.log("Worker " + process.pid + " running a " + webconfig.api.env + " server listening on port " + webconfig.api.port);
}));
