import * as React from "react";
import * as Flex from "react-simple-flex-grid";

import * as Api from "../../Api";

import { SelectUniversal } from "../tools/SelectUniversal";
import { EditorUniversal } from "../tools/EditorUniversal";

import { Items } from "./Items";
import { TicketList } from "./TicketList";

import { ITicket } from "../../models/ITicket";
import { IUser } from "../../models/IUser";
import { ITracker } from "../../models/ITracker";
import { IPriority } from "../../models/IPriority";
import { IStatus } from "../../models/IStatus";
import { ILink } from "../../models/ILink";
import { ILinkTicket } from "../../models/ILinkTicket";
import { IItem } from "../../models/IItem";
import { IItemData } from "../../models/IItemData";

import "./TicketRightContent.scss";

// Props
interface TicketRightContentProps {
    ticket: ITicket;
    readonly: boolean;
    new: boolean;
    highlighting: boolean;
    onChange: (ticket: ITicket) => void;
}

// State
interface TicketRightContentState {
    ticket: ITicket;
    tickets: Array<ITicket>;
    users: Array<IUser>;
    trackers: Array<ITracker>;
    priorities: Array<IPriority>;
    status: Array<IStatus>;
    links: Array<ILink>;
    items: Array<IItem>;
    linkFilters: { link: ILink, ticket: ITicket };
    readonly: boolean;
    highlighting: boolean;
}

export class TicketRightContent extends React.Component<TicketRightContentProps, TicketRightContentState> {    
    constructor(props: TicketRightContentProps) {
        super(props);

        this.state = {
            ticket: this.props.ticket,
            tickets: new Array<ITicket>(),
            users: new Array<IUser>(),
            trackers: new Array<ITracker>(),
            priorities: new Array<IPriority>(),
            status: new Array<IStatus>(),
            links: new Array<ILink>(),
            items: new Array<IItem>(),
            linkFilters: null,
            readonly: this.props.readonly,
            highlighting: this.props.highlighting
        };
    }

    public async componentDidMount(): Promise<void> {
        let { ticket } = this.state;

        const tickets: Array<ITicket> = (await Api.Ticket.find("/tickets") as any).tickets;
        const users: Array<IUser> = (await Api.User.find() as any).users;
        const trackers: Array<ITracker> = (await Api.Tracker.find() as any).trackers;
        const priorities: Array<IPriority> = (await Api.Priority.find() as any).priorities;
        const status: Array<IStatus> = (await Api.Status.find() as any).status;
        const links: Array<ILink> = (await Api.Link.find() as any).links;
        let { items } = this.state;

        if (this.props.new) {
            ticket = ticket || {} as ITicket;
            ticket.tracker = trackers.find(tracker => tracker.id.toString() == this.getParam("tracker"));
            if (ticket.tracker) {
                items = (await Api.Item.findByTracker(ticket.tracker.id) as any).items;

                const data: Array<IItemData> = items.map(item => {
                    return {
                        value: item.universal.defaultValue,
                        item: item
                    } as unknown;
                }) as Array<IItemData>;

                ticket.data = data;
            }
        }

        this.setState({ ticket, tickets, users, trackers, priorities, status, links, items });
        this.props.onChange(ticket);
    }

    public async componentWillReceiveProps(props: TicketRightContentProps): Promise<void> {
        this.setState({ ticket: props.ticket, readonly: props.readonly, highlighting: props.highlighting });
    }

    private getParam(key: string): string {
        return new URL(window.location.href).searchParams.get(key);
    }

    private handleSimpleChange(entity: string, value) {
        let ticket: ITicket = { ...this.state.ticket };
        ticket[entity] = value[entity];

        this.setState({ ticket });
        this.props.onChange(ticket);
    }

    private handleTrackerChange(value) {
        window.location.href = "/tickets/new?tracker=" + value.tracker.id;
        // this.handleSimpleChange("tracker", value);
    }

    private handlePriorityChange(value) {
        this.handleSimpleChange("priority", value);
    }

    private handleStatusChange(value) {
        this.handleSimpleChange("status", value);
    }

    private handleDescriptionChange(value) {
        this.handleSimpleChange("description", { description: !!value ? btoa(value) : null });
    }

    private handleLinkChange(value) {
        let linkFilters = this.state.linkFilters;
        if (linkFilters) {
            linkFilters.link = value.link;
        } else {
            linkFilters = { link: value.link, ticket: null };
        }

        this.setState({ linkFilters });
    }

    private handleTicketChange(value) {
        let linkFilters = this.state.linkFilters;
        if (linkFilters) {
            linkFilters.ticket = value.ticket;
        } else {
            linkFilters = { ticket: value.ticket, link: null };
        }

        this.setState({ linkFilters });
    }

    private handleAddLink(): void {
        const ticket: ITicket = this.state.ticket;
        ticket.referents.push(
            {
                link: this.state.linkFilters.link,
                referent: {
                    id: ticket.id
                } as ITicket,
                reference: {
                    id: this.state.linkFilters.ticket.id
                } as ITicket
            } as ILinkTicket
        );

        this.handleSimpleChange("referents", { referents: ticket.referents });
    }

    private handleRemoveLink(): void {
        const ticket: ITicket = this.state.ticket;
        ticket.referents = ticket.referents.filter(referent => referent.link.id != this.state.linkFilters.link.id || referent.reference.id != this.state.linkFilters.ticket.id);

        this.handleSimpleChange("referents", { referents: ticket.referents });
    }

    public render(): React.ReactNode {
        return <section className="ticket-right-content">
            <fieldset style={ this.state.highlighting ? { backgroundColor: "#e6ecfa" } : {} }>
                <legend>Détails</legend>

                <Flex.Row>
                    <Flex.Col xs={ 12 } md={ 6 }>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Type *</th>
                                    <td>
                                        {
                                            this.state.trackers.length
                                                && <SelectUniversal
                                                        options={ this.state.trackers.map(tracker => ({ value: tracker.id, label: tracker.name, tracker })) }
                                                        defaultValue={ (this.state.ticket && this.state.ticket.tracker)
                                                            ? { value: this.state.ticket.tracker.id, label: this.state.ticket.tracker.name } 
                                                            : undefined }
                                                        name="tracker"
                                                        onChange={ this.handleTrackerChange.bind(this) }
                                                        isDisabled={ !this.props.new } />
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <th>Priorité *</th>
                                    <td>
                                        {
                                            this.state.priorities.length
                                                && <SelectUniversal
                                                        options={ this.state.priorities.map(priority => ({ value: priority.id, label: priority.name, priority })) }
                                                        defaultValue={ !this.props.new 
                                                            ? { value: this.state.ticket.priority.id, label: this.state.ticket.priority.name } 
                                                            : undefined }
                                                        name="priority"
                                                        onChange={ this.handlePriorityChange.bind(this) }
                                                        isDisabled={ this.state.readonly } />
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Flex.Col>
                    <Flex.Col xs={ 12 } md={ 6 }>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Status *</th>
                                    <td>
                                        {
                                            this.state.status.length
                                                && <SelectUniversal
                                                        options={ this.state.status.map(status => ({ value: status.id, label: status.name, status })) }
                                                        defaultValue={ !this.props.new 
                                                            ? { value: this.state.ticket.status.id, label: this.state.ticket.status.name } 
                                                            : undefined }
                                                        name="status"
                                                        onChange={ this.handleStatusChange.bind(this) }
                                                        isDisabled={ this.state.readonly } />
                                        }
                                    </td>
                                </tr>
                                <tr className="ticket-right-content__special-details">
                                    <th>Résolution</th>
                                    <td>{ this.state.ticket && this.state.ticket.status ? this.state.ticket.status.category.name : "" }</td>
                                </tr>
                            </tbody>
                        </table>
                    </Flex.Col>
                </Flex.Row>
            </fieldset>

            {
                (this.state.ticket && this.state.ticket.data && this.state.ticket.data.length)
                    && <fieldset style={ this.state.highlighting ? { backgroundColor: "#ffffee" } : {} }>
                        <legend>Détails personnalisés</legend>
        
                        <Items
                            ticket={ this.state.ticket }
                            readonly={ this.state.readonly }
                            onChange={ console.log } />
                    </fieldset>
                    || null
            }

            <fieldset>
                <legend>Description</legend>

                <div className="ticket-content__description">
                    <EditorUniversal 
                        value={ !this.props.new && this.state.ticket.description ? atob(this.state.ticket.description) : "" }
                        onChange={ this.handleDescriptionChange.bind(this) }
                        readonly={ this.state.readonly } />
                </div>
            </fieldset>

            {
                !this.props.new
                    && <fieldset>
                        <legend>Demandes liées</legend>

                        {
                            !this.state.readonly
                                && <fieldset style={ this.state.highlighting ? { backgroundColor: "#fff4f4" } : {} }>
                                    <legend>Filtres</legend>

                                    <Flex.Row>
                                        <Flex.Col xs={ 12 } md={ 6 }>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <th>Lien</th>
                                                        <td>
                                                            {
                                                                this.state.links.length
                                                                    && <SelectUniversal
                                                                            options={ this.state.links.map(link => ({ value: link.id, label: link.referentDescription, link })) }
                                                                            name="link"
                                                                            onChange={ this.handleLinkChange.bind(this) } />
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Flex.Col>
                                        <Flex.Col xs={ 12 } md={ 6 }>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <th>Ticket</th>
                                                        <td>
                                                            {
                                                                this.state.tickets.length
                                                                    && <SelectUniversal
                                                                            options={ this.state.tickets.filter(ticket => this.props.new || ticket.id != this.state.ticket.id).map(ticket => ({ value: ticket.id, label: "[" + ticket.id + "] " + ticket.summary, ticket })) }
                                                                            name="ticket"
                                                                            onChange={ this.handleTicketChange.bind(this) } />
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Flex.Col>
                                    </Flex.Row>
                                    <Flex.Row>
                                        <Flex.Col xs={ 12 }>
                                            {
                                                (this.state.linkFilters && this.state.linkFilters.ticket)
                                                    && <React.Fragment>
                                                        {
                                                            // console.log("view", this.state.linkFilters.ticket)
                                                        }
                                                        
                                                        <TicketList id="cqcwA2iauz" tickets={ [this.state.linkFilters.ticket] } style={{ margin: "5px 0" }} />
                                                    </React.Fragment>
                                            }
                                        </Flex.Col>
                                        <Flex.Col xs={ 12 }>
                                            {
                                                (this.state.linkFilters && this.state.linkFilters.link && this.state.linkFilters.ticket)
                                                    && <React.Fragment>
                                                        {
                                                            this.state.ticket.referents.find(referent => referent.link.id == this.state.linkFilters.link.id && referent.reference.id == this.state.linkFilters.ticket.id)
                                                                && <input style={{ float: "right" }} type="button" value="Supprimer cette jointure" onClick={ this.handleRemoveLink.bind(this) } />
                                                                || <input type="button" value="Ajouter cette jointure" onClick={ this.handleAddLink.bind(this) } />
                                                        }
                                                    </React.Fragment>
                                            }
                                        </Flex.Col>
                                    </Flex.Row>
                                </fieldset>
                        }

                        {
                            this.state.ticket.referents.map(referent => {
                                return <fieldset>
                                    <legend>{ referent.link.referentDescription }</legend>

                                    <TicketList id={ "3rhmlj7b0I_referent_" + referent.link.id + "_" + referent.reference.id } address={ "/tickets?resourceId=" + referent.reference.id } />
                                </fieldset>;
                            })
                        }

                        {
                            this.state.ticket.references.map(reference => {
                                return <fieldset>
                                    <legend>{ reference.link.referenceDescription }</legend>

                                    <TicketList id={ "BZhDfGTlSk_reference_" + reference.link.id + "_" + reference.referent.id } address={ "/tickets?resourceId=" + reference.referent.id } />
                                </fieldset>;
                            })
                        }
                    </fieldset>
            }
        </section>;
    }
}
