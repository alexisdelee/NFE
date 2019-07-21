import * as React from "react";
import Switch from "rc-switch";

import { IItemData } from "../../models/IItemData";
import { InputFileUniversal } from "../tools/InputFileUniversal";

import "./SwitchUniversal.scss";

// Props
interface InputUniversalProps {
    new: boolean;
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
        this.setState({ data: props.data, readonly: props.readonly });
    }

    private notifyParent(data: IItemData): void {
        this.setState({ data });
        this.props.onChange(data);
    }

    private handleChange(event): void {
        const { data } = this.state;

        if (this.state.data.item.universal.category == "input" && this.state.data.item.universal.label == "checkbox") {
            data.value = event ? "1" : "0";
            
            this.notifyParent(data);
        } else {
            event.target.reportValidity();
            data.value = event.target.value;

            this.props.onChange(data);
        }
    }

    private handleFileChange(data: IItemData): void {
        this.notifyParent(data);
    }
    
    private makeUp(data: IItemData): React.ReactNode {
        if (data.item.universal.category == "input") {
            if (data.item.universal.label == "checkbox") {
                return <Switch 
                            ref={ this.inputRef }
                            checked={ !!parseInt(data.value, 10) }
                            disabled={ !this.props.new && (this.state.readonly || this.state.data.item.readonly) }
                            onChange={ this.handleChange.bind(this)  }
                            onFocus={ event => event.target.reportValidity() } />
            } else if (data.item.universal.category == "input" && data.item.universal.label == "file") {
                return <InputFileUniversal
                            data={ this.state.data }
                            readonly={ !this.props.new && (this.state.readonly || this.state.data.item.readonly) }
                            onChange={ this.handleFileChange.bind(this) } />;
            }
        }

        return <input
                    ref={ this.inputRef }
                    type={ this.state.data.item.universal.label }
                    value={ this.state.data.value }
                    disabled={ !this.props.new && (this.state.readonly || this.state.data.item.readonly) }
                    required={ this.state.data.item.required }
                    onChange={ this.handleChange.bind(this) }
                    onFocus={ event => event.target.reportValidity() }
                    style={{ padding: "7px 8px", fontSize: "14px", width: "100%" }} />
    }

    public render(): React.ReactNode {
        if (this.state.data) {
            return <React.Fragment>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                <span title={ this.state.data.item.options.map(option => option.label + ": " + option.value).join(", ") }>{ this.state.data.item.label + (this.state.data.item.required ? " *" : "") }</span>
                                {
                                    (this.state.data.item.universal.category == "input" && this.state.data.item.universal.label == "file" && !!this.state.data.value)
                                        && 	<React.Fragment>
                                            &nbsp;<small>
                                                <a target="_blanck" href={ this.state.data.value } style={{ textDecoration: "none", color: "gray" }}>(télécharger)</a>
                                            </small>
                                        </React.Fragment>
                                }
                            </th>
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
