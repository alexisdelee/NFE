import * as React from "react";

import { DateTool } from "../tools/DateTool";
import { EditorUniversal } from "../tools/EditorUniversal";

import "./CommentItem.scss";

// Props
interface ICommentItemProps {
    readonly: boolean;
}

// State
interface ICommentItemState {
    readonly: boolean;
}

export class CommentItem extends React.Component<ICommentItemProps, ICommentItemState> {
    public static defaultProps = {
        readonly: false
    };

    private data: string;

    constructor(props: ICommentItemProps) {
        super(props);

        this.data = `
        Description

        The current NFD's source code layout is the product of historical design choices that were made at the beginning of the project. While many of those choices still apply to the codebase, a few others have been superseded and are no longer relevant today. Some notable examples of major design changes that rendered (or will render) the current source code layout partially obsolete are #2489, #4683, and #4528.
        
        This task proposes the following reorganizations.
        
        Move rib/ to daemon/rib/ (already done in commit 1b077f6028543f4304d1e5afe383823d79305ce1)
        Move RibManager to daemon/mgmt/ (already done in commit 8a05c7fd2a00e7c8b53d5c57ccb3c53a756b4997)
        Move core/ files that are only used by the nfd binary to daemon/common/ or any other appropriate subdir of daemon/
        RttEstimator can be left alone since it will be superseded by ndn-cxx's estimator and removed soon in #4887
        
        The split between unit-tests-daemon and unit-tests-rib also doesn't make much sense anymore. I see two possible approaches here: (a) merge unit-tests-rib into unit-tests-daemon, or (b) further split unit-tests-daemon into -face, -table, -mgmt, etc.
        `;

        this.state = { readonly: props.readonly };

        setTimeout.bind(this, function() {
            this.setState({ readonly: true });
        }, 5000);
    }

    public render(): React.ReactNode {
        return <table className="comment-item">
            <tbody>
                <tr>
                    <td>
                        <span>Ajouté par <a href="/tickets/reporter/1">root</a></span><br />
                        <DateTool datetime={ new Date() } prefix="le " />
                    </td>
                    <td>
                        <span>Modifié </span>
                        <DateTool datetime={ new Date() } prefix="le " />
                    </td>
                    {
                        !this.state.readonly && <td>
                            <button className="comment-item__action">Modifier</button>
                            <button className="comment-item__action">Supprimer</button>
                        </td>
                    }
                </tr>
                <tr>
                    <td colSpan={ 3 }>
                        <EditorUniversal
                            value={ this.data }
                            model="comment"
                            onChange={ console.log } 
                            readonly={ this.state.readonly } />
                    </td>
                </tr>
            </tbody>
        </table>;
    }
}
