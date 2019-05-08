import * as React from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";

import "react-mde/lib/styles/css/react-mde-all.css";

// State
interface IEditorUniversalState {
    value: string;
}

export class EditorUniversal extends React.Component<Object, IEditorUniversalState> {
    private converter: Showdown.Converter;
    
    constructor(props: Object) {
        super(props);

        this.state = {
            value: "**Hello world**"
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
    }

    public render(): React.ReactNode {
        return <div>
            <ReactMde
                onChange={ this.updateValue.bind(this) }
                value={ this.state.value }
                generateMarkdownPreview={ markdown =>
                    Promise.resolve(this.converter.makeHtml(markdown))
                } />
        </div>;
    }
}
