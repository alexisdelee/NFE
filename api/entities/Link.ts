import { JsonObject, JsonProperty } from "json2typescript/index";

import { Query } from "./Query";

@JsonObject("Link")
export class Link extends Query {
    @JsonProperty("outward", String)
    public outward: string = undefined;

    @JsonProperty("inward", String)
    public inward: string = undefined;
}
