import * as React from "react";

import { DateTool } from "../tools/DateTool";
import { IHistory } from "../../models/IHistory";

// Props
interface IHistoryProps {
    id: string;
    history: IHistory;
}

// State
interface IHistoryState {
    history: IHistory;
}

export class HistoryItem extends React.Component<IHistoryProps, IHistoryState> {
    public static defaultProps = {
        id: null
    };
    
    constructor(props: IHistoryProps) {
        super(props);

        this.state = {
            history: this.props.history
        };

        console.log(this.props.history);
    }

    public async componentWillReceiveProps(props: IHistoryProps): Promise<void> {
        if (!!props.id && props.id == this.props.id) {
            this.setState({ history: props.history });
        }
    }

    private getColor(category: string): string {
        switch (category) {
            case "resource":
                return "#eefff1"; 
            case "detail":
                return "#e6ecfa";
            case "custom-detail":
                return "#ffffee";
            case "link":
                return "#fff4f4";
        }

        return null;
    }

    public render(): React.ReactNode {
        if (this.state.history) {
            return <tr className="history-item" style={ (color => color ? { backgroundColor: color} : {} )(this.getColor(this.state.history.category)) }>
                <th className="history-item__label" title={ this.state.history.label }>{ this.state.history.label.length > 13 ? this.state.history.label.substr(0, 10) + "..." : this.state.history.label }</th>
                <td className="history-item__previousValue" title={ this.state.history.previousValue }>{ this.state.history.previousValue && this.state.history.previousValue.length > 13 ? this.state.history.previousValue.substr(0, 10) + "..." : this.state.history.previousValue }</td>
                <td className="history-item__nextValue" title={ this.state.history.nextValue }>{ this.state.history.nextValue && this.state.history.nextValue.length > 13 ? this.state.history.nextValue.substr(0, 10) + "..." : this.state.history.nextValue }</td>
                <td className="history-item__user">{ this.state.history.user && this.state.history.user.pseudo }</td>
                <td className="history-item__ticket">
                    {
                        this.state.history.ticket
                            && <a href={ "/tickets/" + this.state.history.ticket.id } title={ this.state.history.ticket.summary }>{ this.state.history.ticket.id }</a>
                    }
                </td>
                <td className="history-item__created">
                    <DateTool datetime={ this.state.history.created } />
                </td>
            </tr>;
        }

        return null;
    }
}
