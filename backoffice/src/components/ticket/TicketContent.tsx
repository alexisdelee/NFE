import * as React from "react";

import { DateTool } from "../tools/DateTool";
import { ListUniversal } from "../tools/ListUniversal";
import { EditorUniversal } from "../tools/EditorUniversal";
import { InputUniversal, InputUniversalType } from "../tools/InputUniversal";
import { CommentList } from "./CommentList";
import { ITicket } from "../../models/ITicket";
import { IUniversal } from "../../models/IUniversal";
import { Api } from "../../Api";

import "./TicketContent.scss";

// Props
interface ITicketContentProps {
    ticket: ITicket;
    ticketId: number;
    readonly: boolean;
    archived: boolean;
}

// State
interface ITicketContentState {
    ticket: ITicket;
    readonly: boolean;
    archived: boolean;
}

export class TicketContent extends React.Component<ITicketContentProps, ITicketContentState> {
    public static defaultProps: ITicketContentProps = {
        ticket: null,
        ticketId: 0,
        readonly: false,
        archived: false
    };

    constructor(props: ITicketContentProps) {
        super(props);

        this.state = {
            ticket: props.ticket,
            readonly: props.readonly || props.archived,
            archived: props.archived
        };
    }

    public async componentDidMount(): Promise<void> {
        try {
            if (this.props.ticket == null) {
                const ticket: ITicket = await Api.Ticket.findOne(this.props.ticketId);
                this.setState({ ticket });
            }
        } catch(err) {
            console.error(err);
        }
    }

    private fetchListUniversal(model: string): Promise<Array<IUniversal>> {
        if (model == "status") {
            return Api.Status.find();
        } else if (model == "priority") {
            return Api.Priority.find();
        } else if (model == "tracker") {
            return Api.Tracker.find();
        } else if (model == "region") {
            return Api.Region.find();
        }

        return Promise.reject("unknown model");
    }

    private updateListUniversal(model: string, ref: IUniversal, readonly: boolean): void {
        if (!readonly) {
            const ticket: ITicket = this.state.ticket;
            ticket[model] = ref || null;

            this.setState({ ticket });
        }
    }

    private updateEditorUniversal(model: string, value: string, readonly: boolean): void {
        if (!readonly) {
            if (model == "ticket") {
                const ticket: ITicket = this.state.ticket;
                ticket.description = value ? btoa(value) : null;

                this.setState({ ticket });
            }
        }
    }

    public render(): React.ReactNode {
        if (this.state.ticket) {
            return <table className={ [ "ticket-content" ].concat(this.state.archived ? "ticket-content__archived" : []).join(" ") }>
                <thead>
                    <tr>
                        <td colSpan={ 2 }>
                            <img className="ticket-content__gravatar" title="Auteur" src="https://www.gravatar.com/avatar/54fc98617b5c0b9a77a8b05f0879490c?rating=PG&size=50&default=wavatar" /><br />
                            <div className="ticket-content__subject">
                                <h3>{ this.state.ticket.summary }</h3>
                                <br />
                                <span>Ajouté par <a href={ "/tickets/reporter/" + this.state.ticket.reporter.id }>{ this.state.ticket.reporter.pseudo }</a> <DateTool datetime={ this.state.ticket.created } prefix="le " />. </span>
                                {
                                    this.state.ticket.updated && <span>Mise à jour <DateTool datetime={ this.state.ticket.updated } prefix="le " />.</span>
                                }
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody className="ticket-content__body">
                    <tr>
                        <td>
                            <ListUniversal 
                                property="Statut" 
                                value={ this.state.ticket.status } 
                                model="status" 
                                onChange={ this.updateListUniversal.bind(this) } 
                                onFetch={ this.fetchListUniversal.bind(this) } 
                                required={ true } 
                                readonly={ this.state.readonly } />
                            
                            <ListUniversal 
                                property="Priorité" 
                                value={ this.state.ticket.priority } 
                                model="priority" 
                                onChange={ this.updateListUniversal.bind(this) } 
                                onFetch={ this.fetchListUniversal.bind(this) } 
                                required={ true } 
                                readonly={ this.state.readonly } />

                            <InputUniversal
                                property="Couleur" 
                                value={ this.state.ticket.color ? "#" + this.state.ticket.color : "#ffffff" } 
                                type={ InputUniversalType.color } 
                                required={ false } 
                                readonly={ this.state.readonly } />

                            <ListUniversal 
                                property="Catégorie" 
                                value={ this.state.ticket.tracker } 
                                model="tracker" 
                                onChange={ this.updateListUniversal.bind(this) } 
                                onFetch={ this.fetchListUniversal.bind(this) } 
                                required={ true } 
                                readonly={ true } />
                            
                            <ListUniversal 
                                property="Région" 
                                value={ this.state.ticket.region } 
                                model="region" 
                                onChange={ this.updateListUniversal.bind(this) } 
                                onFetch={ this.fetchListUniversal.bind(this) } 
                                required={ true } 
                                readonly={ true } />
                        </td>
                        <td>
                            <InputUniversal
                                property="Client" 
                                value="toto" 
                                type={ InputUniversalType.text } 
                                required={ true } 
                                readonly={ true } />

                            <InputUniversal
                                property="Age" 
                                value="" 
                                type={ InputUniversalType.number } 
                                min={ 0 } 
                                max={ 100 } 
                                required={ true } 
                                readonly={ this.state.readonly } />
                        </td>
                    </tr>
                    <tr className="ticket-content__description">
                        <td colSpan={ 2 }>
                            <EditorUniversal 
                                value={ this.state.ticket.description ? atob(this.state.ticket.description) : "" } 
                                model="ticket"
                                onChange={ this.updateEditorUniversal.bind(this) } 
                                readonly={ this.state.readonly } />
                        </td>
                    </tr>
                    {
                        /* <tr className="ticket-content__comments">
                            <CommentList readonly={ this.state.readonly } />
                        </tr> */
                    }
                </tbody>
            </table>;
        }

        return null;
    }
}
