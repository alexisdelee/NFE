import * as React from "react";

import { CommentItem } from "./CommentItem";

// Props
interface CommentListProps {
    readonly: boolean;
}

// State
interface CommentListState {
    readonly: boolean;
}

export class CommentList extends React.Component<CommentListProps, CommentListState> {
    public static defaultProps = {
        readonly: false
    };
    
    constructor(props: CommentListProps) {
        super(props);

        this.state = { readonly: props.readonly };
    }

    public render(): React.ReactNode {
        return <React.Fragment>
            <CommentItem readonly={ true } />
        </React.Fragment>;
    }
}
