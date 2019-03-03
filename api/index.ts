import { UserRepository } from "./repositories/UserRepository";
import { ABaseRepository } from "./repositories/base/ABaseRepository";
import { User } from "./entities/User";

import * as Q from "q";

(Q as any).spawn(function *() {
    try {
        const repository: UserRepository = new UserRepository();

        const user: User = yield repository.findOne(1);
        console.log(user);

        const status: boolean = yield repository.create(user);
        console.log(status);
    } catch(err) {
        console.log("error");
        console.log(err.message);
    } finally {
        ABaseRepository.close();
    }
});
