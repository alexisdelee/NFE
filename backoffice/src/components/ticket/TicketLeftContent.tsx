import * as React from "react";

import { Permission, PermissionMethod } from "../../Permission";
import * as Api from "../../Api";

import { DateTool } from "../tools/DateTool";
import { SelectUniversal } from "../tools/SelectUniversal";

import { ITicket } from "../../models/ITicket";
import { IUser } from "../../models/IUser";
import { IAssignee } from "../../models/IAssignee";
import { IRegion } from "../../models/IRegion";

// Props
interface TicketLeftContentProps {
    ticket: ITicket;
    readonly: boolean;
    new: boolean;
    onChange: (ticket: ITicket) => void;
    onSave: () => Promise<void>;
    onDelete: () => Promise<void>;
    onArchived: () => Promise<void>;
}

// State
interface TicketLeftContentState {
    ticket: ITicket;
    users: Array<IUser>;
    regions: Array<IRegion>;
    readonly: boolean;
}

export class TicketLeftContent extends React.Component<TicketLeftContentProps, TicketLeftContentState> {    
    constructor(props: TicketLeftContentProps) {
        super(props);

        this.state = {
            ticket: { ...this.props.ticket },
            users: new Array<IUser>(),
            regions: new Array<IRegion>(),
            readonly: this.props.readonly
        };
    }

    public async componentDidMount(): Promise<void> {
        const users: Array<IUser> = (await Api.User.find() as any).users;
        const regions: Array<IRegion> = (await Api.Region.find() as any).regions;

        let ticket: ITicket = this.state.ticket;
        if (!ticket.reporter) {
            ticket.reporter = users.find(user => user.id == Permission.parseFromStorage().userId) || null;
        }

        this.setState({ users, regions, ticket });
        this.props.onChange(ticket);
    }

    public async componentWillReceiveProps(props: TicketLeftContentProps): Promise<void> {
        this.setState({ ticket: props.ticket });
    }

    private handleSimpleChange(entity: string, value) {
        let ticket: ITicket = { ...this.state.ticket };
        ticket[entity] = value[entity];

        this.setState({ ticket });
        this.props.onChange(ticket);
    }

    private handleRegionChange(value) {
        this.handleSimpleChange("region", value);
    }

    private handleAssigneeChange(values) {
        let assignees: Array<IAssignee> = new Array<IAssignee>();
        let ticket: ITicket = { ...this.state.ticket };
        if (values) {
            assignees = values.map(value => {
                return {
                    user: value.user,
                    ticket: {
                        id: this.state.ticket.id
                    } as ITicket
                } as IAssignee;
            });
        }

        ticket.assignees = assignees;
        this.setState({ ticket });

        this.props.onChange(ticket);
    }

    public render(): React.ReactNode {
        return <section className="ticket-left-content">
            <fieldset>
                <legend>Ressources</legend>

                <table>
                    <tbody>
                        <tr>
                            <th>Région concernée *</th>
                            <td>
                                {
                                    this.state.regions.length
                                        && <SelectUniversal
                                                options={ this.state.regions.map(region => ({ value: region.id, label: region.name, region })) }
                                                defaultValue={ !this.props.new 
                                                    ? { value: this.state.ticket.region.id, label: this.state.ticket.region.name }
                                                    : undefined
                                                }
                                                name="region"
                                                onChange={ this.handleRegionChange.bind(this) }
                                                isDisabled={ !this.props.new } />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Ajouté par</th>
                            <td>
                                {
                                    (this.state.ticket && this.state.ticket.reporter)
                                        && <SelectUniversal
                                                options={ [] }
                                                defaultValue={ { value: this.state.ticket.reporter.id, label: this.state.ticket.reporter.pseudo, reporter: this.state.ticket.reporter } }
                                                name="reporter"
                                                onChange={ () => {} }
                                                isDisabled={ true } />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Assigné(s) à *</th>
                            <td>
                                {
                                    this.state.users.length
                                        && <SelectUniversal
                                                isMulti={ true }
                                                options={ this.state.users.map(user => ({ value: user.id, label: user.pseudo, user })) }
                                                defaultValue={ !this.props.new && this.state.ticket.assignees.map(assignee => ({ value: assignee.user.id, label: assignee.user.pseudo, user: assignee.user })) }
                                                name="assignees"
                                                onChange={ this.handleAssigneeChange.bind(this) }
                                                isDisabled={ this.state.readonly } />
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>

            <fieldset>
                <legend>Dates</legend>

                <table>
                    <tbody>
                        <tr>
                            <th>Créer le</th>
                            <td>
                                {
                                    this.state.ticket
                                        && <DateTool datetime={ this.state.ticket.created } />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Mis à jour le</th>
                            <td>
                                {
                                    (this.state.ticket && this.state.ticket.updated)
                                        && <DateTool datetime={ this.state.ticket.updated } />
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>

            {
                !this.state.readonly
                    && <fieldset>
                        <legend>Administration</legend>

                        <input type="button" value="Sauvegarder" onClick={ this.props.onSave.bind(this) } />&nbsp;

                        {
                            !this.props.new
                                && <React.Fragment>
                                    {
                                        Permission.parseFromStorage().has("tickets", PermissionMethod.DELETE)
                                            && <React.Fragment>
                                                <input type="button" value="Supprimer" onClick={ this.props.onDelete.bind(this) } />&nbsp;
                                            </React.Fragment>
                                    }

                                    <input type="button" value="Archiver" onClick={ this.props.onArchived.bind(this) } />
                                </React.Fragment>
                        }
                    </fieldset>
            }
        </section>;
    }
}
