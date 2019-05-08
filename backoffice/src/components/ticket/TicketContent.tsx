import * as React from "react";

import { DateTool } from "../tools/DateTool";
import { ListUniversal } from "../tools/ListUniversal";
import { EditorUniversal } from "../tools/EditorUniversal";
import { ITicket } from "../../models/ITicket";
import { Api } from "../../Api";

import "./TicketContent.scss";

// Props
interface ITicketContentProps {
    ticket: ITicket;
    ticketId: number;
}

// State
interface ITicketContentState {
    ticket: ITicket;
}

export class TicketContent extends React.Component<ITicketContentProps, ITicketContentState> {
    public static defaultProps: ITicketContentProps = {
        ticket: null,
        ticketId: 0
    };

    constructor(props: ITicketContentProps) {
        super(props);

        this.state = { ticket: props.ticket };
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

    public render(): React.ReactNode {
        if (this.state.ticket) {
            return <table className="ticket-content">
                <thead>
                    <tr>
                        <td colSpan={ 2 }>
                            <img className="ticket-content__gravatar" title="Auteur" src="https://www.gravatar.com/avatar/54fc98617b5c0b9a77a8b05f0879490c?rating=PG&size=50&default=wavatar" /><br />
                            <div className="ticket-content__subject">
                                <h3>{ this.state.ticket.summary }</h3>
                                <br />
                                <span>Ajouté par <a href={ "/tickets/" + this.state.ticket.reporter.id }>{ this.state.ticket.reporter.pseudo }</a> <DateTool datetime={ this.state.ticket.created } prefix="le " />. </span>
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
                            <ListUniversal property="Statut" value={ this.state.ticket.status.name } model="status" universalId={ this.state.ticket.status.id } />
                            <ListUniversal property="Priorité" value={ this.state.ticket.priority.name } model="priority" universalId={ this.state.ticket.priority.id } />
                        </td>
                        <td>
                            <ListUniversal property="Catégorie" value={ this.state.ticket.tracker.name } model="tracker" universalId={ this.state.ticket.tracker.id } readonly={ true } />
                            <ListUniversal property="Région" value={ this.state.ticket.region.name } model="region" universalId={ this.state.ticket.region.id } readonly={ true } />
                        </td>
                    </tr>
                    <tr className="ticket-content__description">
                        <td colSpan={ 2 }>
                            <EditorUniversal />
                        </td>
                    </tr>
                </tbody>
            </table>;
        }

        return null;
    }
}
