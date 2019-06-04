import * as React from "react";

import { StatusItemUniversal } from "./StatusItemUniversal";
import { IItemOption } from "../../models/IItemOption";

import "./InputUniversal.scss";

// Props
interface IInputUniversalProps {
    property: string;
    value: string | number | boolean;
    type: InputUniversalType;
    pattern: string;
    options: Array<IItemOption>;
    readonly: boolean;
    required: boolean;
    onChange: (property: string, value: string, readonly: boolean) => void;
}

// State
interface IInputUniversalState {
    value: string | number | boolean;
    options: Array<IItemOption>;
    error: boolean;
    readonly: boolean;
    required: boolean;
}

export enum InputUniversalType {
    checkbox = "checkbox",
    color = "color",
    time = "time",
    date = "date",
    week = "week",
    month = "month",
    email = "email",
    file = "file",
    number = "number",
    confidential = "password",
    phone = "tel",
    text = "text"
};

export class InputUniversal extends React.Component<IInputUniversalProps, IInputUniversalState> {
    private inputRef: React.RefObject<any> = React.createRef();

    public static defaultProps = {
        pattern: null,
        readonly: false,
        required: false
    };

    constructor(props: IInputUniversalProps) {
        super(props);

        this.state = {
            value: props.value,
            options: props.options,
            error: null,
            readonly: props.readonly,
            required: props.required
        };
    }

    public componentDidMount(): any {
        for (const option of this.state.options) {
            this.inputRef.current.setAttribute(option.label, option.value);
        }
    }

    private checkValidity(target): boolean {
        target.reportValidity();
        this.setState({ error: !target.checkValidity() });

        return target.checkValidity();
    }

    private updateItem(event): void {
        if (!this.state.readonly) {
            let value = null;
            if (this.props.type == InputUniversalType.checkbox) {
                this.setState({ value: (value = event.target.checked) });
            } else {
                this.setState({ value: (value = event.target.value) });
            }

            if (this.checkValidity(event.target)) {
                this.props.onChange(this.props.property, value, this.state.readonly);
            }
        }
    }

    private buildGenericType(): React.ReactNode {
        if (this.props.type == InputUniversalType.phone) {
            return <input 
                        ref={ this.inputRef }
                        type={ this.props.type } 
                        value={ this.state.value.toString() } 
                        placeholder={ this.props.pattern || "0[6-9][0-9]{8}" } 
                        pattern={ this.props.pattern || "0[6-9][0-9]{8}" } 
                        onChange={ this.updateItem.bind(this) } 
                        onFocus={ this.updateItem.bind(this) } 
                        disabled={ this.state.readonly } 
                        required={ this.state.required } />
        } else if (this.props.type == InputUniversalType.checkbox) {
            return <input 
                        ref={ this.inputRef }
                        type={ this.props.type } 
                        checked={ eval(this.state.value as string) as boolean } 
                        onChange={ this.updateItem.bind(this) } 
                        disabled={ this.state.readonly } 
                        required={ this.state.required } />
        }

        return <input 
                    ref={ this.inputRef }
                    type={ this.props.type } 
                    value={ this.state.value.toString() } 
                    onChange={ this.updateItem.bind(this) } 
                    onFocus={ this.updateItem.bind(this) } 
                    disabled={ this.state.readonly }
                    required={ this.state.required } />;
    }

    public render(): React.ReactNode {
        return <table className="input-universal">
            <tbody>
                <tr>
                    <td className="input-universal__status">
                        <StatusItemUniversal
                            fields={ this.props.property } 
                            error={ this.state.error }
                            readonly={ this.state.readonly } />
                    </td>
                    <th>{ this.props.property + (this.state.required ? "*" : "") }</th>
                    <td>
                        {
                            this.buildGenericType()
                        }
                    </td>
                </tr>
            </tbody>
        </table>;
    }
}
