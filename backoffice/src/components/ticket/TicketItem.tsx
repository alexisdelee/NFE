import * as React from "react";

import { DateTool } from "../tools/DateTool";
import { ITicket } from "../../models/ITicket";
import { IAssignee } from "../../models/IAssignee";

// Props
interface ITicketProps {
    id: string;
    ticket: ITicket;
}

// State
interface ITicketState {
    ticket: ITicket;
    isClosed: boolean;
}

export class TicketItem extends React.Component<ITicketProps, ITicketState> {
    public static defaultProps = {
        id: null
    };
    
    constructor(props: ITicketProps) {
        super(props);

        this.state = {
            ticket: this.props.ticket,
            isClosed: ["done", "solution"].includes(this.props.ticket.status.category.shortname)
        };
    }

    public async componentWillReceiveProps(props: ITicketProps): Promise<void> {
        if (!!props.id && props.id == this.props.id) {
            this.setState({ ticket: props.ticket });
        }
    }

    public render(): React.ReactNode {
        if (this.state.ticket) {
            return <tr className={ this.state.isClosed ? "ticket-item closed" : "ticket-item" }>
                <td className="ticket-item__id">
                    <a href={ "/tickets/" + this.state.ticket.id }  title={ this.state.ticket.status.name }>{ this.state.ticket.id }</a>
                </td>
                <td className="ticket-item__tracker">
                    <a href={ "/tickets?resource=tracker&resourceId=" + this.state.ticket.tracker.id }>{ this.state.ticket.tracker.name }</a>
                </td>
                <td className="ticket-item__status">
                    <a href={ "/tickets?resource=status&resourceId=" + this.state.ticket.status.id }>{ this.state.ticket.status.name }</a>
                </td>
                <td className="ticket-item__priority">
                    <a href={ "/tickets?resource=priority&resourceId=" + this.state.ticket.priority.id }>{ this.state.ticket.priority.name }</a>
                </td>
                <td className="ticket-item__subject">
                    <a href={ "/tickets/" + this.state.ticket.id } title={ this.state.ticket.status.name }>{ this.state.ticket.summary }</a>
                </td>
                <td className="ticket-item__reporter_by">
                    <a href={ "/tickets?resource=reporter&resourceId=" + this.state.ticket.reporter.id }>{ this.state.ticket.reporter.pseudo }</a>
                </td>
                <td className="ticket-item__assign_to">
                    {
                        this.state.ticket.assignees
                        .map((assignee: IAssignee) => {
                            return <a href={ "/tickets?resource=assignee&resourceId=" + assignee.user.id }>{ assignee.user.pseudo }</a>;
                        })
                    }
                </td>
                <td className="ticket-item__update_at">
                    {
                        this.state.ticket.updated && <DateTool datetime={ this.state.ticket.updated } />
                    }
                </td>
            </tr>;
        }

        return null;
    }
}
