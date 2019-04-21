import { GlobalData } from "./data/GlobalData";
import { Request } from "./utils/QueryWrapper";

import { ABaseRepository } from "./repositories/base/ABaseRepository";
import { CategoryRepository } from "./repositories/CategoryRepository";
import { Category } from "./entities/Category";
import { CommentaryRepository } from "./repositories/CommentaryRepository";
import { Commentary } from "./entities/Commentary";

import { Anonymous, Agent } from "./business/User";

import * as Q from "q";

Q.spawn(function *() {
    try {
        // yield GlobalData.boot();
        // console.log(global.nfe.category.latest);

        // const category: Category = yield new CategoryRepository().findOne(1);
        // console.log(category);

        /* console.log(Anonymous.artefact);
        console.log(Agent.artefact);

        console.log(Anonymous.artefact === Agent.artefact);
        console.log(Anonymous.artefact === Anonymous.artefact); */

        const commentary: Commentary = yield new CommentaryRepository().findOne(1, Request.FetchType.Lazy);
        console.log(commentary);
    } catch(err) {
        console.log("error");
        console.log(err.message);
    } finally {
        ABaseRepository.close();
    }
});
