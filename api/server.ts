import * as express from "express";
import * as Q from "q";

import application from "./Application";
import { HttpError, ServerError, cover } from "./utils/HttpWrapper";
import { GlobalData } from "./data/GlobalData";

const webconfig = require("../webconfig");

application.use((error: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
        if (error) {
            if (error instanceof SyntaxError) {
                throw new HttpError(ServerError.InternalServerError, "invalid synthax");
            }

            throw new HttpError(ServerError.InternalServerError, error.message ? error.message : "internal error");
        }
    } catch(err) {
        response.status(err.code).json(cover(null, [ err.message ]));
    }
});

application.listen(webconfig.api.port, Q.async(function *() {
    yield GlobalData.boot();
    console.log("Worker " + process.pid + " running a " + webconfig.env + " server listening on port " + webconfig.api.port);
}));
