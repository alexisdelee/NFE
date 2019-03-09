import { GlobalData } from "./data/GlobalData";

import { ABaseRepository } from "./repositories/base/ABaseRepository";
import { UserRepository } from "./repositories/UserRepository";
import { CommentaryRepository } from "./repositories/CommentaryRepository";
import { User } from "./entities/User";
import { Commentary } from "./entities/Commentary";

import * as Q from "q";

(Q as any).spawn(function *() {
    try {
        yield GlobalData.boot();
        console.log(global.nfe.category.done.id);

        // CommentaryRepository
        const commentaryRepository: CommentaryRepository = new CommentaryRepository();
        const commentary: Commentary = yield commentaryRepository.findOne(1);
        console.log(commentary);

        // UserRepository
        const userRepository: UserRepository = new UserRepository();

        const user: User = yield userRepository.findOne(1);
        console.log(user);

        const status: boolean = yield userRepository.create(user);
        console.log(status);
    } catch(err) {
        console.log("error");
        console.log(err.message);
    } finally {
        ABaseRepository.close();
    }
});
