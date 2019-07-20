import * as React from "react";
import * as Flex from "react-simple-flex-grid";

const createWTClient = require("@wetransfer/js-sdk");

export class InputFileUniversal extends React.Component<Object, Object> {
    public async handleUploadFiles(event): Promise<void> {
        const api: string = "0IGvw2aHPW9kxnKWFaVWZlbv8EgpNdZap7Gcl0f4";

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

        console.log(url);
    }

    public render(): React.ReactNode {
        return <input
                    type="file"
                    onChange={ this.handleUploadFiles.bind(this) }
                    style={{ padding: "7px 8px", fontSize: "14px", width: "100%" }} />;
    }
}
