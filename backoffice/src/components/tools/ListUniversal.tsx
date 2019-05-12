import * as React from "react";

import { StatusItemUniversal } from "./StatusItemUniversal";
import { IUniversal } from "../../models/IUniversal";

import "./ListUniversal.scss";

// Props
interface IListUniversalProps {
    property: string;
    value: IUniversal;
    model: string;
    required: boolean;
    readonly: boolean;
    onFetch: (model: string) => Promise<Array<IUniversal>>;
    onChange: (model: string, ref: IUniversal, readonly: boolean) => void;
}

// State
interface IListUniversalState {
    items: Array<IUniversal>;
    itemId: number;
    error: boolean;
    required: boolean;
    readonly: boolean;
}

export class ListUniversal extends React.Component<IListUniversalProps, IListUniversalState> {
    public static defaultProps = {
        required: false,
        readonly: false
    };
    
    constructor(props: IListUniversalProps) {
        super(props);

        this.state = {
            items: null,
            itemId: this.props.value.id,
            error: null,
            required: props.required,
            readonly: props.readonly
        };
    }

    public async componentDidMount(): Promise<void> {
        try {
            this.setState({ items: await this.props.onFetch(this.props.model) });
        } catch(err) {
            console.error(err);
        }
    }

    private updateItem(event): void {
        if (!this.state.readonly) {
            const itemId: number = +event.target.value;
            const item = this.state.items.find(item => item.id === itemId);

            if (item == undefined && this.state.required) {
                this.setState({ error: true });
                return;
            }

            this.setState({ itemId, error: false });
            this.props.onChange(this.props.model, item, this.state.readonly);
        }
    }

    public render(): React.ReactNode {
        if (this.state.items) {
            return <table className="list-universal">
                <tbody>
                    <tr>
                        <td className="input-universal__status">
                            <StatusItemUniversal
                                fields={ this.props.property } 
                                error={ this.state.error }
                                readonly={ this.state.readonly } />
                        </td>
                        <th>{ this.props.property }</th>
                        <td>
                            <select disabled={ this.state.readonly } onChange={ this.updateItem.bind(this) } value={ this.state.itemId }>
                                {
                                    this.state.required || <option></option>
                                }
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
