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
    loading: boolean;
    highlighting: boolean;
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
    loading: boolean;
    highlighting: boolean;
}

export class TicketLeftContent extends React.Component<TicketLeftContentProps, TicketLeftContentState> {    
    constructor(props: TicketLeftContentProps) {
        super(props);

        this.state = {
            ticket: { ...this.props.ticket },
            users: new Array<IUser>(),
            regions: new Array<IRegion>(),
            readonly: this.props.readonly,
            loading: this.props.loading,
            highlighting: this.props.highlighting
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

    public componentWillReceiveProps(props: TicketLeftContentProps): void {
        props.ticket.reporter = this.state.ticket.reporter;
        this.setState({ ticket: props.ticket, loading: props.loading, highlighting: props.highlighting });
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
            <fieldset style={ this.state.highlighting ? { backgroundColor: "#eefff1" } : {} }>
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
                                                isDisabled={ this.state.readonly || !this.props.new } />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Ajouté par *</th>
                            <td>
                                {
                                    (this.state.ticket && this.state.ticket.reporter)
                                        && <SelectUniversal
                                                options={ this.state.users.map(user => ({ value: user.id, label: user.pseudo, user })) }
                                                defaultValue={ { value: this.state.ticket.reporter.id, label: this.state.ticket.reporter.pseudo, reporter: this.state.ticket.reporter } }
                                                name="reporter"
                                                onChange={ () => {} }
                                                isDisabled={ true } />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Assigné(s) à</th>
                            <td>
                                {
                                    this.state.users.length
                                        && <SelectUniversal
                                                isMulti={ true }
                                                options={ this.state.users.map(user => ({ value: user.id, label: user.pseudo, user })) }
                                                defaultValue={ !this.props.new && this.state.ticket.assignees.map(assignee => ({ value: assignee.user.id, label: assignee.user.pseudo, user: assignee.user })) }
                                                name="assignees"
                                                onChange={ this.handleAssigneeChange.bind(this) }
                                                isDisabled={ this.state.readonly || this.props.new } />
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

            <fieldset>
                <legend>Administration</legend>

                <table style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}>
                                {
                                    this.state.loading
                                        && <img src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" height={ 80 } style={{ filter: "grayscale(100%)" }} />
                                }
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: "center" }}>
                                {
                                    (!this.state.readonly && !this.state.loading)
                                        && <React.Fragment>
                                            <input type="button" value="Sauvegarder" onClick={ this.props.onSave.bind(this) } />&nbsp;
                                        </React.Fragment>
                                }

                                {
                                    (!this.state.readonly && !this.props.new && !this.state.loading)
                                        && <React.Fragment>
                                            {
                                                Permission.parseFromStorage().has("tickets", PermissionMethod.DELETE)
                                                    && <React.Fragment>
                                                        <input 
                                                            type="button"
                                                            value="Supprimer"
                                                            onClick={ this.props.onDelete.bind(this) } />&nbsp;
                                                    </React.Fragment>
                                            }

                                            {
                                                Permission.parseFromStorage().has("tickets", PermissionMethod.UPDATE)
                                                    && <React.Fragment>
                                                        <input type="button" value="Archiver" onClick={ this.props.onArchived.bind(this) } />&nbsp;
                                                    </React.Fragment>
                                            }
                                        </React.Fragment>
                                }

                                {
                                    (!this.props.new && Permission.parseFromStorage().has("histories", PermissionMethod.READ))
                                        && <button onClick={ () => window.open("/tickets/" + this.state.ticket.id + "/history?no-header=true", "Historique des modicications", "menubar=no, status=no, scrollbars=no, menubar=no, width=826, height=450") }>Historique des modifications</button>
                                        || null
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
            
        </section>;
    }
}
