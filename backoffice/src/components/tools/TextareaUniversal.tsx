import * as React from "react";

import { IItemData } from "../../models/IItemData";

// Props
interface ITextareaUniversalProps {
    new: boolean;
    data: IItemData;
    readonly: boolean;
    onChange: (data: IItemData) => void;
}

// State
interface ITextareaUniversalState {
    data: IItemData;
    readonly: boolean;
}

export class TextareaUniversal extends React.Component<ITextareaUniversalProps, ITextareaUniversalState> {
    private inputRef: React.RefObject<any>;

    constructor(props: ITextareaUniversalProps) {
        super(props);

        this.inputRef = React.createRef();

        this.state = {
            data: this.props.data,
            readonly: this.props.readonly
        };
    }

    public componentDidMount(): void {
        for (const option of this.state.data.item.options) {
            this.inputRef.current.setAttribute(option.label, option.value);
        }
    }

    public componentWillReceiveProps(props: ITextareaUniversalProps): void {
        this.setState({ data: props.data, readonly: props.readonly });
    }

    private notifyParent(data: IItemData): void {
        this.setState({ data });
        this.props.onChange(data);
    }

    private handleChange(event): void {
        const { data } = this.state;

        event.target.reportValidity();
        data.value = event.target.value;

        this.notifyParent(data);
    }

    public render(): React.ReactNode {
        if (this.state.data) {
            return <React.Fragment>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                <span title={ this.state.data.item.options.map(option => option.label + ": " + option.value).join(", ") }>{ this.state.data.item.label + (this.state.data.item.required ? " *" : "") }</span>
                            </th>
                            <td>
                                {
                                    this.state.data
                                        && <textarea
                                                ref={ this.inputRef }
                                                value={ this.state.data.value }
                                                disabled={ !this.props.new && (this.state.readonly || this.state.data.item.readonly) }
                                                required={ this.state.data.item.required }
                                                onChange={ this.handleChange.bind(this) }
                                                onFocus={ event => event.target.reportValidity() }
                                                style={{ width: "100%", height: "50px", resize: "vertical" }}></textarea>
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
