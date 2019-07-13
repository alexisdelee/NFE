import * as React from "react";
import Select from "react-select";

// Props
interface ISelectUniversalProps {
    isMulti: boolean;
    defaultValue: any;
    options: any;
    name: string;
    isDisabled: boolean;
    onChange: (values: any) => void;
}

// State
interface ISelectUniversalState {
    isMulti: boolean;
    defaultValue: any;
    options: any;
    name: string;
    isDisabled: boolean;
}

export class SelectUniversal extends React.Component<ISelectUniversalProps, ISelectUniversalState> {
    public static defaultProps = {
        isMulti: false,
        defaultValue: undefined,
        isDisabled: false
    };
    
    constructor(props: ISelectUniversalProps) {
        super(props);

        this.state = {
            isMulti: this.props.isMulti,
            defaultValue: this.props.defaultValue,
            options: this.props.options,
            name: this.props.name,
            isDisabled: this.props.isDisabled
        };
    }

    public render(): React.ReactNode {
        if (this.state.isMulti) {
            return <React.Fragment>
                <Select
                    defaultValue={ this.state.defaultValue }
                    name={ this.state.name }
                    isMulti
                    closeMenuOnSelect={ false }
                    options={ this.state.options }
                    theme={theme => ({
                        ...theme,
                        borderRadius: 0,
                        minWidth: 1
                    })}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={ this.props.onChange.bind(this) }
                    isDisabled={ this.state.isDisabled} />
            </React.Fragment>;
        }

        return <React.Fragment>
            <Select
                defaultValue={ this.state.defaultValue }
                name={ this.state.name }
                options={ this.state.options }
                theme={theme => ({
                    ...theme,
                    borderRadius: 0,
                    minWidth: 1
                })}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={ this.props.onChange.bind(this) }
                isDisabled={ this.state.isDisabled} />
        </React.Fragment>;
    }
}
