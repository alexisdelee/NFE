import * as React from "react";

import { IUniversal } from "../../models/IUniversal";
import { Api } from "../../Api";

import "./ListUniversal.scss";

// Props
interface IListUniversalUniversalProps {
    property: string;
    value: IUniversal;
    model: string;
    readonly: boolean;
    onChange: (model: string, ref: IUniversal, readonly: boolean) => void;
}

// State
interface IListUniversalUniversalState {
    readonly: boolean;
    items: Array<IUniversal>;
    itemId: number;
}

export class ListUniversal extends React.Component<IListUniversalUniversalProps, IListUniversalUniversalState> {
    public static defaultProps = {
        readonly: false
    };
    
    constructor(props: IListUniversalUniversalProps) {
        super(props);

        this.state = {
            readonly: props.readonly,
            items: null,
            itemId: this.props.value.id
        };
    }

    public async componentDidMount(): Promise<void> {
        try {
            if (this.props.model == "status") {
                this.setState({ items: await Api.Status.find() });
            } else if (this.props.model == "priority") {
                this.setState({ items: await Api.Priority.find() });
            } else if (this.props.model == "tracker") {
                this.setState({ items: await Api.Tracker.find() });
            } else if (this.props.model == "region") {
                this.setState({ items: await Api.Region.find() });
            }
        } catch(err) {
            console.error(err);
        }
    }

    private updateItem(event): void {
        const itemId: number = +event.target.value;
        const item = this.state.items.find(item => item.id === itemId);

        this.setState({ itemId });
        this.props.onChange(this.props.model, item, this.state.readonly);
    }

    public render(): React.ReactNode {
        if (this.state.items) {
            return <table className="list-universal">
                <tbody>
                    <tr>
                        <th>{ this.props.property }</th>
                        <td>
                            <select disabled={ this.state.readonly } onChange={ this.updateItem.bind(this) } value={ this.state.itemId }>
                                {
                                    this.state.items.map(item => {
                                        return <option value={ item.id }>{ item.name }</option>;
                                    })
                                }
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>;
        }

        return null;
    }
}
