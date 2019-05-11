import * as React from "react";

import StatusItem from "./StatusItem";

import "./StatusItemUniversal.scss";

// Props
interface IStatusItemUniversalProps {
    fields: string;
    error: boolean;
    readonly: boolean;
}

// State
interface IStatusItemUniversalState {
    mode: StatusItem;
    readonly: boolean;
}

export class StatusItemUniversal extends React.Component<IStatusItemUniversalProps, IStatusItemUniversalState> {
    public static defaultProps = {
        readonly: false
    };

    public static Status: StatusItem;
    
    constructor(props: IStatusItemUniversalProps) {
        super(props);

        this.state = {
            mode: null,
            readonly: props.readonly
        };
    }

    public componentWillReceiveProps(props): void {
        if (props.error != null) {
            this.setState({ mode: props.error ? StatusItem.Error : StatusItem.Done });
        }
    }

    private getAllStyles(): string {
        let classes: Array<string> = [ StatusItem.Default.value.classname ];

        if (!this.state.readonly) {
            classes.push(StatusItem.Wait.value.classname);

            if (this.state.mode != null) {
                classes.push(this.state.mode.value.classname);
            }
        }

        return classes.join(" ");
    }

    public render(): React.ReactNode {
        return <React.Fragment>
            <span title={ "orange = aucune modification\nrouge = une erreur est survenue\nvert = modification effectuée sans problème" } className={ this.getAllStyles() }>{ !this.state.readonly ? "?" : "" }</span>
        </React.Fragment>;
    };
}
