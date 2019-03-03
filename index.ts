import { UserRepository } from "./repositories/UserRepository";
import { ABaseRepository } from "./repositories/base/ABaseRepository";
import { User } from "./entities/User";

import * as Q from "q";

(Q as any).spawn(function *() {
    try {
        const repository: UserRepository = new UserRepository();
        const user: User = yield repository.findOne(1);

        console.log(user);
    } catch(err) {
        console.log("error");
        console.log(err);
    } finally {
        ABaseRepository.close();
    }
});
