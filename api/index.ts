import { ABaseRepository } from "./repositories/base/ABaseRepository";
import { UniversalWrapperBusiness } from "./business/UniversalWrapperBusiness";
import { UniversalWrapper } from "./entities/UniversalWrapper";

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

        const wrapper: UniversalWrapper = yield UniversalWrapperBusiness.findByTicket(1);
        console.log(wrapper);
    } catch(err) {
        console.log("error");
        console.log(err);
    } finally {
        ABaseRepository.close();
    }
});
