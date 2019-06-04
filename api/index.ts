import { ABaseRepository } from "./repositories/base/ABaseRepository";
import { ItemWrapperBusiness } from "./business/ItemWrapperBusiness";
import { ItemWrapper } from "./entities/ItemWrapper";

import * as Q from "q";
import { JsonConvert, ValueCheckingMode } from "json2typescript/index";

Q.spawn(function *() {
    try {
        // debug
        /* const category: object = JSON.parse("{ \"name\": \"toto\", \"shortname\": \"test\" }");
        const jsonConvert: JsonConvert = new JsonConvert();
        jsonConvert.ignorePrimitiveChecks = false;
        jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

        console.log(category);
        const c: Category = jsonConvert.deserializeObject(category, Category);
        console.log(c, typeof c, c instanceof Category);

        return; */
        // debug

        const wrapper: ItemWrapper = yield ItemWrapperBusiness.findByTicket(1);
        console.log(JSON.stringify(wrapper, null, 2));
    } catch(err) {
        console.log("error");
        console.log(err);
    } finally {
        ABaseRepository.close();
    }
});
