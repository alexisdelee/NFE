import * as React from "react";

import { InputUniversal, InputUniversalType } from "./InputUniversal";
import { IUniversalWrapper } from "../../models/IUniversalWrapper";

import "./StatusItemUniversal.scss";

// Props
interface IStatusItemUniversalProps {
    universal: IUniversalWrapper;
    readonly: boolean;
}

// State
interface IStatusItemUniversalState {
    universal: IUniversalWrapper;
    readonly: boolean;
}

export class Universal extends React.Component<IStatusItemUniversalProps, IStatusItemUniversalState> {    
    constructor(props: IStatusItemUniversalProps) {
        super(props);

        this.state = {
            universal: props.universal,
            readonly: props.readonly
        };

        console.log(props.universal);
    }

    private choiceUniversal(): React.ReactNode {
        if (this.state.universal.universal.category == "input") {
            return <InputUniversal
                        property={ this.state.universal.item.label }
                        value={ this.state.universal.data.value }
                        type={ InputUniversalType[this.state.universal.universal.label] }
                        required={ this.state.universal.item.required }
                        readonly={ this.state.readonly || this.state.universal.item.readonly }
                        options={ this.state.universal.options }
                        onChange={ console.log } />;
        }
    }

    public render(): React.ReactNode {
        return this.choiceUniversal();
    };
}
