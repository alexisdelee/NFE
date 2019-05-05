import { JsonObject, JsonProperty } from "json2typescript/index";

import { Query } from "./Query";

@JsonObject("Category")
export class Category extends Query {
    @JsonProperty("name", String)
    public name: string = undefined;

    @JsonProperty("shortname", String)
    public shortname: string = undefined;
}
