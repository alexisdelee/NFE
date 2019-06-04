import * as React from "react";

import { InputUniversal, InputUniversalType } from "./InputUniversal";
import { IItemWrapper } from "../../models/IItemWrapper";

import "./StatusItemUniversal.scss";

// Props
interface IStatusItemUniversalProps {
    wrapper: IItemWrapper;
    readonly: boolean;
}

// State
interface IStatusItemUniversalState {
    wrapper: IItemWrapper;
    readonly: boolean;
}

export class Universal extends React.Component<IStatusItemUniversalProps, IStatusItemUniversalState> {    
    constructor(props: IStatusItemUniversalProps) {
        super(props);

        this.state = {
            wrapper: props.wrapper,
            readonly: props.readonly
        };

        console.log(props.wrapper);
    }

    private choiceUniversal(): React.ReactNode {
        if (this.state.wrapper.universal.category == "input") {
            return <InputUniversal
                        property={ this.state.wrapper.item.label }
                        value={ this.state.wrapper.data.value }
                        type={ InputUniversalType[this.state.wrapper.universal.label] }
                        required={ this.state.wrapper.item.required }
                        readonly={ this.state.readonly || this.state.wrapper.item.readonly }
                        options={ this.state.wrapper.options }
                        onChange={ console.log } />;
        }
    }

    public render(): React.ReactNode {
        return this.choiceUniversal();
    };
}
