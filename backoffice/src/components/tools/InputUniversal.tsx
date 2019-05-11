import * as React from "react";

import { StatusItemUniversal } from "./StatusItemUniversal";

import "./InputUniversal.scss";

// Props
interface IInputUniversalProps {
    property: string;
    value: string | number;
    type: InputUniversalType;
    pattern: string;
    min: number;
    max: number;
    readonly: boolean;
    required: boolean;
}

// State
interface IInputUniversalState {
    value: string | number;
    error: boolean,
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
    public static defaultProps = {
        pattern: null,
        readonly: false,
        required: false,
        min: -Infinity,
        max: Infinity
    };

    constructor(props: IInputUniversalProps) {
        super(props);

        this.state = {
            value: props.value,
            error: null,
            readonly: props.readonly,
            required: props.required
        };
    }

    private checkValidity(event): void {
        const colorItem: HTMLElement = event.target.closest("tr").querySelector(".input-universal__status");

        event.target.reportValidity();

        this.setState({ error: !event.target.checkValidity() });
        this.setState({ value: event.target.value });
    }

    private buildGenericType(): React.ReactNode {
        if (this.props.type == InputUniversalType.phone) {
            return <input 
                        type={ this.props.type } 
                        value={ this.state.value } 
                        placeholder={ this.props.pattern || "0[6-9][0-9]{8}" } 
                        pattern={ this.props.pattern || "0[6-9][0-9]{8}" } 
                        onChange={ this.checkValidity.bind(this) } 
                        onFocus={ this.checkValidity.bind(this) } 
                        disabled={ this.state.readonly } 
                        required={ this.state.required } />
        } else if (this.props.type == InputUniversalType.number) {
            return <input 
                        type={ this.props.type } 
                        value={ this.state.value } 
                        min={ this.props.min } 
                        max={ this.props.max } 
                        onChange={ this.checkValidity.bind(this) } 
                        onFocus={ this.checkValidity.bind(this) } 
                        disabled={ this.state.readonly } 
                        required={ this.state.required } />
        }

        return <input 
                    type={ this.props.type } 
                    value={ this.state.value } 
                    onChange={ this.checkValidity.bind(this) } 
                    onFocus={ this.checkValidity.bind(this) } 
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
