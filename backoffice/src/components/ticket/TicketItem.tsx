import * as React from "react";

import { DateTool } from "../tools/DateTool";
import { ITicket } from "../../models/ITicket";

// Props
interface ITicketProps {
    ticket: ITicket;
}

// State
interface ITicketState {
    ticket: ITicket;
    isClosed: boolean;
}

export class TicketItem extends React.Component<ITicketProps, ITicketState> {
    constructor(props: ITicketProps) {
        super(props);

        this.state = {
            ticket: this.props.ticket,
            isClosed: ["done", "solution"].includes(this.props.ticket.status.category.shortname)
        };
    }

    public render(): React.ReactNode {
        if (this.state.ticket) {
            return <tr className={ this.state.isClosed ? "ticket-item closed" : "ticket-item" }>
                <td className="ticket-item__toggle"><input type="checkbox" /></td>
                <td className="ticket-item__id">
                    <a href={ "/tickets/" + this.state.ticket.id }>{ this.state.ticket.id }</a>
                </td>
                <td className="ticket-item__color" style={{ backgroundColor: this.state.ticket.color == null ? "" : "#" + this.state.ticket.color }}></td>
                <td className="ticket-item__tracker">
                    <a href={ "/tickets/tracker/" + this.state.ticket.tracker.id }>{ this.state.ticket.tracker.name }</a>
                </td>
                <td className="ticket-item__status">
                    <a href={ "/tickets/status/" + this.state.ticket.status.id }>{ this.state.ticket.status.name }</a>
                </td>
                <td className="ticket-item__priority">
                    <a href={ "/tickets/priority/" + this.state.ticket.priority.id }>{ this.state.ticket.priority.name }</a>
                </td>
                <td className="ticket-item__subject">
                    <a href={ "/tickets/" + this.state.ticket.id }>{ this.state.ticket.summary }</a>
                </td>
                <td className="ticket-item__reporter_by">
                    <a href={ this.state.ticket.reporter == null ? "#" : "/tickets/reporter/" + this.state.ticket.reporter.id }>{ this.state.ticket.reporter == null ? "" : this.state.ticket.reporter.pseudo }</a>
                </td>
                <td className="ticket-item__assign_to">
                    <a href={ this.state.ticket.assignee == null ? "#" : "/tickets/assignee/" + this.state.ticket.assignee.id }>{ this.state.ticket.assignee == null ? "" : this.state.ticket.assignee.pseudo }</a>
                </td>
                <td className="ticket-item__update_at">
                    {
                        this.state.ticket.updated && <DateTool datetime={ this.state.ticket.updated } />
                    }
                </td>
                <td className="ticket-item__tags"></td>
            </tr>;
        }

        return null;
    }
}
