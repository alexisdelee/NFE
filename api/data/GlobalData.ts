import { Data } from "./Data";
import { makeCoffee } from "../decorators/wrapper";
import { CategoryData } from "./CategoryData";
import { PriorityData } from "./PriorityData";
import { RoleData } from "./RoleData";
import { StatusData } from "./StatusData";
import { TrackerData } from "./TrackerData";

export class GlobalData {
    @makeCoffee
    public static *boot(): IterableIterator<any> {
        global.nfe = new Data();
        global.nfe.category = yield CategoryData.create();
        global.nfe.priority = yield PriorityData.create();
        global.nfe.role = yield RoleData.create();
        global.nfe.status = yield StatusData.create();
        global.nfe.tracker = yield TrackerData.create();
    }
}
