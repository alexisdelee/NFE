import { Fetch, FetchType } from "./utils/Fetch";

import { IAuthentication } from "./models/IAuthentication";
import { ITicket } from "./models/ITicket";
import { IStatus } from "./models/IStatus";
import { IPriority } from "./models/IPriority";
import { ITracker } from "./models/ITracker";
import { IRegion } from "./models/IRegion";
import { IItem } from "./models/IItem";
import { IUser } from "./models/IUser";
import { ILink } from "./models/ILink";
import { IHistory } from "./models/IHistory";

export class Path {
    public static resolve(address: string): string {
        if (window.location.hostname == "localhost") {
            return new URL(address, "http://localhost:8080").href;
        }

        return new URL(address, "https://nfe-official.herokuapp.com").href;
    }
}

export class Authentication {
    public static async login(nfeid: string, password: string): Promise<IAuthentication> {
        return await new Fetch<IAuthentication>(Path.resolve("/auth/login"), FetchType.POST, { nfeid, password }).json();
    }
}

export class Ticket {
    public static async find(address: string): Promise<Array<ITicket>> {
        return await new Fetch<Array<ITicket>>(Path.resolve(address)).json();
    }

    public static async findOne(ticketId: number): Promise<ITicket> {
        return await new Fetch<ITicket>(Path.resolve("/tickets/" + ticketId)).json();
    }

    public static async post(ticket: ITicket): Promise<ITicket> {
        return await new Fetch<ITicket>(Path.resolve("/tickets"), FetchType.POST, { ...ticket }).json();
    }

    public static async save(ticketId: number, ticket: ITicket): Promise<ITicket> {
        return await new Fetch<ITicket>(Path.resolve("/tickets/" + ticketId), FetchType.PUT, { ...ticket }).json();
    }

    public static async delete(ticketId: number): Promise<void> {
        return await new Fetch<void>(Path.resolve("/tickets/" + ticketId), FetchType.DELETE).json();
    }
};

export class Item {
    public static async findByTracker(trackerId: number): Promise<Array<IItem>> {
        return await new Fetch<Array<IItem>>(Path.resolve("/items/trackers/" + trackerId)).json();
    }

    public static async updateByTicket(ticketId: number, wrapper: IItem): Promise<void> {
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

export class User {
    public static async find(): Promise<Array<IUser>> {
        return await new Fetch<Array<IUser>>(Path.resolve("/users")).json();
    }
}

export class Link {
    public static async find(): Promise<Array<ILink>> {
        return await new Fetch<Array<ILink>>(Path.resolve("/links")).json();
    }
}

export class History {
    public static async findByTicket(ticketId: number): Promise<Array<IHistory>> {
        return await new Fetch<Array<IHistory>>(Path.resolve("/histories/" + ticketId)).json();
    }
}

export class Statistic {
    public static async findWithDuration(typeDuration: string): Promise<Array<ITicket>> {
        return await new Fetch<Array<ITicket>>(Path.resolve("/statistics/duration?type-duration=" + typeDuration)).json();
    }
}
