import * as React from "react";

import { IItemData } from "../../models/IItemData";

const createWTClient = require("@wetransfer/js-sdk");

// Props
interface InputFileUniversalProps {
    data: IItemData;
    readonly: boolean;
    onChange: (data: IItemData) => void;
}

// State
interface InputFileUniversalState {
    data: IItemData;
    readonly: boolean;
}

export class InputFileUniversal extends React.Component<InputFileUniversalProps, InputFileUniversalState> {
    private inputRef: React.RefObject<any>;
    
    constructor(props: InputFileUniversalProps) {
        super(props);

        this.state = {
            data: props.data,
            readonly: props.readonly
        };
    }

    public componentDidMount(): void {
        for (const option of this.state.data.item.options) {
            this.inputRef.current.setAttribute(option.label, option.value);
        }
    }

    public componentWillReceiveProps(props: InputFileUniversalProps): void {
        this.setState({ data: props.data, readonly: props.readonly });
    }

    public async handleUploadFiles(event): Promise<void> {
        const api: string = "0IGvw2aHPW9kxnKWFaVWZlbv8EgpNdZap7Gcl0f4"; // false token, just for the tests

        this.setState({ readonly: true });

        let files = event.target.files;
        if (files.length == 0) {
            return; // do something
        } else {
            files = Array.from(files)
        }

        // Step 1: Authorization
        // Step 2: Create a new transfer
        // Step 3: Request upload URLs
        // Step 4: File Upload
        // Step 5: Complete a file upload
        // Step 6: Finalize a transfer
        const wtClient = await createWTClient(api);
        const { url } = await wtClient.transfer.create({
            message: files.map(content => content.name).join(", "),
            files: files.map(content => ({ name: content.name, size: content.size, content }))
        });

        let data: IItemData = this.state.data;
        data.value = url;

        this.notifyParent(data);
    }

    private notifyParent(data: IItemData): void {
        this.setState({ data, readonly: false });
        this.props.onChange(data);
    }

    public render(): React.ReactNode {
        return <React.Fragment>
            <input
                type="file"
                disabled={ this.state.readonly }
                onChange={ this.handleUploadFiles.bind(this) }
                style={{ padding: "7px 8px", width: "100%" }} />
        </React.Fragment>;
    }
}
