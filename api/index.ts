import { GlobalData } from "./data/GlobalData";
import { Request } from "./utils/QueryWrapper";

import { ABaseRepository } from "./repositories/base/ABaseRepository";
import { CategoryRepository } from "./repositories/CategoryRepository";
import { Category } from "./entities/Category";
import { CommentaryRepository } from "./repositories/CommentaryRepository";
import { Commentary } from "./entities/Commentary";

import { User } from "./entities/User";
import { Operator } from "./business/User";

import * as Q from "q";

Q.spawn(function *() {
    try {
        yield GlobalData.boot();
        // console.log(global.nfe.category.latest);

        // const category: Category = yield new CategoryRepository().findOne(1);
        // console.log(category);

        const commentary: Commentary = yield new CommentaryRepository().findOne(1, Request.FetchType.Lazy);
        console.log(commentary);

        /* yield new Operator(<User>{
            pseudo: "toto",
            password: "toto"
        }).create(); */

        const status: boolean = yield Operator.sign("ccsf2gdzojuxtyz74", "toto");
        console.log(status);
    } catch(err) {
        console.log("error");
        console.log(err);
    } finally {
        ABaseRepository.close();
    }
});
