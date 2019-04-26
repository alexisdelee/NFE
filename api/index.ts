import { GlobalData } from "./data/GlobalData";
import { Request } from "./utils/QueryWrapper";

import { TicketBusiness } from "./business/TicketBusiness";
import { ABaseRepository } from "./repositories/base/ABaseRepository";
import { CommentaryRepository } from "./repositories/CommentaryRepository";
import { RegionRepository } from "./repositories/RegionRepository";
import { Commentary } from "./entities/Commentary";
import { Ticket } from "./entities/Ticket";
import { Region } from "./entities/Region";

import * as Q from "q";

Q.spawn(function *() {
    try {
        yield GlobalData.boot();

        const commentary: Commentary = yield new CommentaryRepository().findOne(1, Request.FetchType.Lazy);
        console.log(commentary);

        const ticket: Ticket = yield TicketBusiness.find(1);
        const region: Region = yield new RegionRepository().findOne(2, Request.FetchType.Lazy);

        yield new TicketBusiness(ticket).modifyResource<Region>(region, "region");

        const tickets: Array<Ticket> = yield TicketBusiness.findByResource(3, "region");
        console.log(tickets.length);
    } catch(err) {
        console.log("error");
        console.log(err);
    } finally {
        ABaseRepository.close();
    }
});
