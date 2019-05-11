class StatusItemStyle {
    public constructor(public readonly classname: string) {
    }
}

export default class StatusItem {
    public static Default = new StatusItem("Default", new StatusItemStyle("universal__status__default"));
    public static Wait = new StatusItem("Wait", new StatusItemStyle("universal__status__editable"));
    public static Error = new StatusItem("Error", new StatusItemStyle("universal__status__invalid"));
    public static Done = new StatusItem("Done", new StatusItemStyle("universal__status__modified"));

    private constructor(private key: string, public readonly value: StatusItemStyle) {
    }

    public toString(): string {
        return this.key;
    }
}
