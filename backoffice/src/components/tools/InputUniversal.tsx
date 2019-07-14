import * as React from "react";
import Switch from "rc-switch";

import { ITicket } from "../../models/ITicket";
import { IItemData } from "../../models/IItemData";

import "./SwitchUniversal.scss";

// Props
interface InputUniversalProps {
    data: IItemData;
    readonly: boolean;
    onChange: (data: IItemData) => void;
}

// State
interface InputUniversalState {
    data: IItemData;
    readonly: boolean;
}

export class InputUniversal extends React.Component<InputUniversalProps, InputUniversalState> {
    private inputRef: React.RefObject<any>;

    constructor(props: InputUniversalProps) {
        super(props);

        this.inputRef = React.createRef();

        this.state = {
            data: this.props.data,
            readonly: this.props.readonly
        };
    }

    public componentDidMount(): void {
        if (this.state.data.item.universal.label != "checkbox") {
            for (const option of this.state.data.item.options) {
                this.inputRef.current.setAttribute(option.label, option.value);
            }
        }
    }

    public componentWillReceiveProps(props: InputUniversalProps): void {
        this.setState({ data: props.data });
    }

    private handleChange(event): void {
        const { data } = this.state;

        if (this.state.data.item.universal.label == "checkbox") {
            data.value = event ? "1" : "0";
        } else {
            data.value = event.target.value;
        }

        this.setState({ data });
        this.props.onChange(data);
    }
    
    private makeUp(data: IItemData): React.ReactNode {
        if (data.item.universal.label == "checkbox") {
            return <Switch 
                        ref={ this.inputRef }
                        checked={ !!parseInt(data.value, 10) }
                        disabled={ this.state.readonly || this.state.data.item.readonly }
                        onChange={ this.handleChange.bind(this)  } />
        }

        return <input
                    ref={ this.inputRef }
                    type={ this.state.data.item.universal.label }
                    value={ this.state.data.value }
                    disabled={ this.state.readonly || this.state.data.item.readonly }
                    onChange={ this.handleChange.bind(this) }
                    style={{ padding: "7px 8px", fontSize: "14px", width: "100%" }} />
    }

    public render(): React.ReactNode {
        if (this.state.data) {
            return <React.Fragment>
                <table>
                    <tbody>
                        <tr>
                            <th>{ this.state.data.item.label + (this.state.data.item.required ? " *" : "") }</th>
                            <td>
                                {
                                    this.state.data
                                        && this.makeUp(this.state.data)
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>;
        }

        return null;
    }
}
