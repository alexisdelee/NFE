import * as React from "react";
import "react-simple-flex-grid/lib/main.css";

import * as Api from "../../Api";

import { HistoryItem } from "./HistoryItem";
import { IHistory } from "../../models/IHistory";

import "./HistoryList.scss";

// Props
interface IHistoryListProps {
    id: string;
    ticketId: number;
    style: any;
}

// State
interface IHistoryState {
    ticketId: number;
    histories: Array<IHistory>;
}

export class HistoryList extends React.Component<IHistoryListProps, IHistoryState> {
    public static defaultProps = {
        id: null,
        style: {}
    };

    constructor(props: IHistoryListProps) {
        super(props);

        this.state = {
            ticketId: this.props.ticketId,
            histories: new Array<IHistory>()
        };
    }

    public async componentDidMount(): Promise<void> {
        if (this.state.ticketId) {
            this.setState({ histories: (await Api.History.findByTicket(this.state.ticketId) as any).histories});
        }
    }

    public async componentWillReceiveProps(props: IHistoryListProps): Promise<void> {
        if (!!props.id && props.id == this.props.id) {
            this.setState({ ticketId: props.ticketId, histories: (await Api.History.findByTicket(props.ticketId) as any).histories });
        }
    }

    public render(): React.ReactNode {
        if (this.state.histories.length) {
            return <table className="history-list" style={{ ...this.props.style }}>
                <thead>
                    <tr>
                        <th>Label</th>
                        <th>Ancienne valeur</th>
                        <th>Nouvelle valeur</th>
                        <th>Pseudo de l'utilisateur</th>
                        <th>Ticket</th>
                        <th>Date de modification</th>
                    </tr>
                </thead>
                <tbody className="history-list__content">
                    {
                        this.state.histories.map(history => <HistoryItem id={ this.props.id } history={ history } />)
                    }
                </tbody>
            </table>;
        }

        return <span>Aucune modification enregistrée</span>;
    }
}
