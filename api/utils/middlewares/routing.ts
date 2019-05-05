import * as express from "express";

import { HttpError, ClientError } from "../HttpWrapper";

enum Validation {
    Id = "[0-9]{1,20}"
};

export class Routing {
    public static readonly Validation: typeof Validation = Validation;

    public static build(parameter: string, validation: Validation) {
        return `:${parameter}(${validation})`;
    }
}
