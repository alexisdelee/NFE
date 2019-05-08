import { JsonProperty } from "json2typescript/index";

export class Query {
    @JsonProperty("id", Number)
    public id: number = undefined;

    public created: Date;
    public updated: Date;
}
