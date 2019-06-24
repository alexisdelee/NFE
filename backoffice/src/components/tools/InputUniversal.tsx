import * as React from "react";

import { StatusItemUniversal } from "./StatusItemUniversal";
import { ASharedComponent } from "./ASharedComponent";
import { IItemWrapper } from "../../models/IItemWrapper";

import "./InputUniversal.scss";

// Props
interface IInputUniversalProps {
    wrapper: IItemWrapper;
    type: InputUniversalType;
    pattern: string;
    readonly: boolean;
    required: boolean;
}

// State
interface IInputUniversalState {
    wrapper: IItemWrapper;
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

export class InputUniversal extends ASharedComponent<IInputUniversalProps, IInputUniversalState> {
    private static interval: NodeJS.Timeout = null;
    
    private inputRef: React.RefObject<any> = React.createRef();

    public static defaultProps = {
        pattern: null,
        readonly: false,
        required: false
    };

    constructor(props: IInputUniversalProps) {
        super(props);

        this.state = {
            wrapper: props.wrapper,
            error: null,
            readonly: props.readonly,
            required: props.required
        };
    }

    public componentDidMount(): any {
        super.componentDidMount();
        this.subscribe("wrapper", "value");

        for (const option of this.state.wrapper.options) {
            this.inputRef.current.setAttribute(option.label, option.value);
        }
    }

    private checkValidity(target): boolean {
        target.reportValidity();
        this.setState({ error: !target.checkValidity() });

        return target.checkValidity();
    }

    private updateData(value: any): Promise<any> {
        const self = this;

        return new Promise(resolve => {
            self.state.wrapper.data.value = value;
            self.setState({ wrapper: self.state.wrapper }, resolve);
        });
    }

    private sendInterval(): void {
        if (InputUniversal.interval) {
            clearTimeout(InputUniversal.interval);
        }

        const self = this;
        InputUniversal.interval = setTimeout(async function() {
            InputUniversal.interval = null;
            
            self.publish("wrapper", self.state.wrapper);
        }, 1000);
    }

    private async updateItem(event): Promise<void> {
        event = { ...event };

        if (!this.state.readonly) {
            if (this.props.type == InputUniversalType.checkbox) {
                await this.updateData(event.target.checked);
            } else {
                await this.updateData(event.target.value);
            }

            if (this.checkValidity(event.target)) {
                this.sendInterval();
            }
        }
    }

    private buildGenericType(): React.ReactNode {
        if (this.props.type == InputUniversalType.phone) {
            return <input 
                        ref={ this.inputRef }
                        type={ this.props.type } 
                        value={ this.state.wrapper.data.value.toString() } 
                        placeholder={ this.props.pattern || "0[6-9][0-9]{8}" } 
                        pattern={ this.props.pattern || "0[6-9][0-9]{8}" } 
                        onChange={ this.updateItem.bind(this) } 
                        onFocus={ this.updateItem.bind(this) } 
                        disabled={ this.state.readonly } 
                        required={ this.state.required } />;
        } else if (this.props.type == InputUniversalType.checkbox) {
            return <input 
                        ref={ this.inputRef }
                        type={ this.props.type } 
                        checked={ eval(this.state.wrapper.data.value as string) as boolean } 
                        onChange={ this.updateItem.bind(this) } 
                        disabled={ this.state.readonly } 
                        required={ this.state.required } />;
        }

        return <input 
                    ref={ this.inputRef }
                    type={ this.props.type } 
                    value={ this.state.wrapper.data.value.toString() } 
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
                            fields={ this.props.wrapper.item.label } 
                            error={ this.state.error }
                            readonly={ this.state.readonly } />
                    </td>
                    <th>{ this.props.wrapper.item.label + (this.state.required ? "*" : "") }</th>
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
