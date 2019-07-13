import * as React from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";

import "react-mde/lib/styles/css/react-mde-all.css";
import "./EditorUniversal.scss";

type Mode = "write" | "preview";

// Props
interface IEditorUniversalProps {
    value: string;
    readonly: boolean;
    onChange: (data: string) => void;
}

// State
interface IEditorUniversalState {
    value: string;
    mode: Mode;
    readonly: boolean;
}

export class EditorUniversal extends React.Component<IEditorUniversalProps, IEditorUniversalState> {
    public static defaultProps = {
        readonly: false
    };

    private converter: Showdown.Converter;
    
    constructor(props: IEditorUniversalProps) {
        super(props);

        this.state = {
            value: props.value,
            mode: "preview",
            readonly: props.readonly
        };

        this.converter = new Showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            tasklists: true
        });
    }

    private updateValue(value: string): void {
        this.setState({ value });
        this.props.onChange(value);
    }

    private trick(mode: Mode): void {
        if (!this.props.readonly) {
            this.setState(state => {
                return state.mode == mode ? null : { mode };
            });
        }
    }

    public render(): React.ReactNode {
        return <React.Fragment>
            <ReactMde
                onChange={ this.updateValue.bind(this) }
                value={ this.state.value }
                readOnly={ this.props.readonly }
                selectedTab={ this.state.mode }
                onTabChange={ this.trick.bind(this) }
                className={ [ "editor-universal" ].concat(this.props.readonly ? "editor-universal__hide" : []).join(" ") }
                minPreviewHeight={ 0 }
                minEditorHeight={ 270 }
                generateMarkdownPreview={ markdown =>
                    Promise.resolve(this.converter.makeHtml(markdown))
                } />
        </React.Fragment>;
    }
}
