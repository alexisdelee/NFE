import { ITicket } from "./models/ITicket";
import { IStatus } from "./models/IStatus";
import { IPriority } from "./models/IPriority";
import { ITracker } from "./models/ITracker";
import { IRegion } from "./models/IRegion";
import { Fetch, FetchType } from "./utils/Fetch";
import { IItemWrapper } from "./models/IItemWrapper";

export class Path {
    public static readonly host: string = "http://localhost:3001";

    public static resolve(address: string): string {
        return new URL(address, Path.host).href;
    }
}

export class Ticket {
    public static async find(address: string): Promise<Array<ITicket>> {
        return await new Fetch<Array<ITicket>>(Path.resolve(address)).json();
    }

    public static async findOne(ticketId: number): Promise<ITicket> {
        return await new Fetch<ITicket>(Path.resolve("/tickets/" + ticketId)).json();
    }
};

export class Item {
    public static async findByTicket(ticketId: number): Promise<Array<IItemWrapper>> {
        return await new Fetch<Array<IItemWrapper>>(Path.resolve("/items/ticket/" + ticketId)).json();
    }

    public static async updateByTicket(ticketId: number, wrapper: IItemWrapper): Promise<void> {
        return await new Fetch<void>(Path.resolve("/items/ticket/" + ticketId), FetchType.PUT, { ...wrapper }).json();
    }
}

export class Status {
    public static async find(): Promise<Array<IStatus>> {
        return await new Fetch<Array<IStatus>>(Path.resolve("/status")).json();
    }
}

export class Priority {
    public static async find(): Promise<Array<IPriority>> {
        return await new Fetch<Array<IPriority>>(Path.resolve("/priorities")).json();
    }
}

export class Tracker {
    public static async find(): Promise<Array<ITracker>> {
        return await new Fetch<Array<ITracker>>(Path.resolve("/trackers")).json();
    }
}

export class Region {
    public static async find(): Promise<Array<IRegion>> {
        return await new Fetch<Array<IRegion>>(Path.resolve("/regions")).json();
    }
}
