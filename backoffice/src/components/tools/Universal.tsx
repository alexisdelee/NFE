import * as React from "react";

import { InputUniversal, InputUniversalType } from "./InputUniversal";
import { IItemWrapper } from "../../models/IItemWrapper";
import { Item } from "../../Api";

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
    }

    private choiceUniversal(): React.ReactNode {
        if (this.state.wrapper.item.universal.category == "input") {
            return <InputUniversal
                        wrapper={ this.state.wrapper }
                        type={ InputUniversalType[this.state.wrapper.item.universal.label] }
                        required={ this.state.wrapper.item.required }
                        readonly={ this.state.readonly || this.state.wrapper.item.readonly } />;
        }
    }

    public render(): React.ReactNode {
        return this.choiceUniversal();
    };
}
