import * as React from "react";
import "react-simple-flex-grid/lib/main.css";

import { TicketItem } from "./TicketItem";
import { ITicket } from "../../models/ITicket";
import * as Api from "../../Api";

import "./TicketList.scss";

// Props
interface ITicketListProps {
    id: string;
    address: string;
    tickets: Array<ITicket>;
    style: any;
    readonly: boolean;
}

// State
interface ITicketListState {
    tickets: Array<ITicket>;
    readonly: boolean;
}

export class TicketList extends React.Component<ITicketListProps, ITicketListState> {
    public static defaultProps: ITicketListProps = {
        id: null,
        address: "",
        tickets: new Array<ITicket>(),
        style: {},
        readonly: false
    };

    constructor(props: ITicketListProps) {
        super(props);

        this.state = {
            tickets: this.props.tickets,
            readonly: this.props.readonly
        };
    }

    public async componentDidMount(): Promise<void> {
        if (this.state.tickets.length == 0) {
            this.setState({ tickets: (await Api.Ticket.find(this.props.address) as any).tickets });
        }
    }

    public async componentWillReceiveProps(props: ITicketListProps): Promise<void> {
        if (!!props.id && props.id == this.props.id) {
            if (!!props.address) {
                this.setState({ tickets: (await Api.Ticket.find(this.props.address) as any).tickets });
            } else {
                this.setState({ tickets: props.tickets });
            }
        }
    }

    private getParam(key: string): string {
        return new URL(window.location.href).searchParams.get(key);
    }

    public render(): React.ReactNode {
        if (this.state.tickets) {
            return <table className="ticket-list" style={{ ...this.props.style }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Statut</th>
                        <th>Priorité</th>
                        <th>Sujet</th>
                        <th>
                            <a href="/tickets?resource=reporter">Reporté par</a>
                        </th>
                        <th>
                            <a href="/tickets?resource=assignee">Assigné à</a>
                        </th>
                        <th>Dernière mise à jour</th>
                    </tr>
                </thead>
                <tbody className="ticket-list__content">
                    {
                        this.state.tickets.map(ticket => <TicketItem id={ this.props.id } ticket={ ticket } />)
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={ 1 }></td>
                        <td colSpan={ 6 }>
                            {
                                this.getParam("resource")
                                    && <span>Filtre(s) sur&#160;
                                            <span className="ticket-list__filter">{ this.getParam("resource") }</span>
                                            {
                                                this.getParam("resourceId")
                                                    && <span>
                                                            &#160;et&#160;
                                                            <span className="ticket-list__filter">{ this.getParam("resourceId") }</span>
                                                    </span>
                                            }
                                            <a href="/tickets">&#160;/&#160;supprimer filtre(s)</a>
                                    </span>
                            }
                        </td>
                        <td colSpan={ 1 }>
                            {
                                !this.state.readonly
                                    && (
                                        ["/tickets", "/tickets/"].indexOf(window.location.pathname) > -1
                                            && <a href={ "/tickets/new" + (this.getParam("resource") == "tracker" 
                                            && this.getParam("resourceId") ? "?tracker=" + this.getParam("resourceId") : "") }>Ajouter un ticket</a>
                                    )
                            }
                        </td>
                    </tr>
                </tfoot>
            </table>;
        }

        return null;
    }
}
