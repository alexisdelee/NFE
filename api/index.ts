import { GlobalData } from "./data/GlobalData";

import { ABaseRepository } from "./repositories/base/ABaseRepository";
import { CategoryRepository } from "./repositories/CategoryRepository";
import { Category } from "./entities/Category";

import * as Q from "q";

Q.spawn(function *() {
    try {
        yield GlobalData.boot();
        console.log(global.nfe.category.latest);

        // const category: Category = yield new CategoryRepository().findOne(1);
        // console.log(category);
    } catch(err) {
        console.log("error");
        console.log(err.message);
    } finally {
        ABaseRepository.close();
    }
});
