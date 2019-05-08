import { ITicket } from "./models/ITicket";
import { IStatus } from "./models/IStatus";
import { IPriority } from "./models/IPriority";
import { ITracker } from "./models/ITracker";
import { IRegion } from "./models/IRegion";
import { Fetch } from "./utils/Fetch";

export namespace Api {
    export namespace Path {
        export const host: string = "http://localhost:3001";

        export function resolve(address: string): string {
            return new URL(address, Api.Path.host).href;
        }
    };

    export namespace Ticket {
        export async function find(address: string): Promise<Array<ITicket>> {
            return await new Fetch<Array<ITicket>>(Api.Path.resolve(address)).json();
        }

        export async function findOne(ticketId: number): Promise<ITicket> {
            return await new Fetch<ITicket>(Api.Path.resolve("/tickets/" + ticketId)).json();
        }
    };

    export namespace Status {
        export async function find(): Promise<Array<IStatus>> {
            return await new Fetch<Array<IStatus>>(Api.Path.resolve("/status")).json();
        }
    }

    export namespace Priority {
        export async function find(): Promise<Array<IPriority>> {
            return await new Fetch<Array<IPriority>>(Api.Path.resolve("/priorities")).json();
        }
    }

    export namespace Tracker {
        export async function find(): Promise<Array<ITracker>> {
            return await new Fetch<Array<ITracker>>(Api.Path.resolve("/trackers")).json();
        }
    }

    export namespace Region {
        export async function find(): Promise<Array<IRegion>> {
            return await new Fetch<Array<IRegion>>(Api.Path.resolve("/regions")).json();
        }
    }
}
