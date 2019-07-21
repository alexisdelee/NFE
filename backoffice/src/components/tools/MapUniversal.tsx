import * as React from "react";
import { IItemData } from "../../models/IItemData";

// Props
interface IMapUniversalProps {
    new: boolean;
    data: IItemData;
    readonly: boolean;
    onChange: (data: IItemData) => void;
}

// State
interface IMapUniversalState {
    data: IItemData;
    latitude: number;
    longitude: number;
    readonly: boolean;
}

export class MapUniversal extends React.Component<IMapUniversalProps, IMapUniversalState> {    
    private inputRef: React.RefObject<any>;

    constructor(props: IMapUniversalProps) {
        super(props);

        this.inputRef = React.createRef();

        const coords = this.parseCoords(props.data);
        this.state = {
            data: this.props.data,
            latitude: coords.latitude,
            longitude: coords.longitude,
            readonly: this.props.readonly
        };
    }

    public componentDidMount(): void {
        for (const option of this.state.data.item.options) {
            this.inputRef.current.setAttribute(option.label, option.value);
        }
    }

    public componentWillReceiveProps(props: IMapUniversalProps): void {
        const coords = this.parseCoords(props.data);
        this.setState({
            data: props.data,
            readonly: props.readonly,
            latitude: coords.latitude,
            longitude: coords.longitude
        });
    }

    private parseCoords(data): { latitude: number, longitude: number } {
        const coords = { latitude: null, longitude: null };
        if (!!data.value && data.value.includes("@")) {
            const geo = data.value.split("@");
            if (geo.length >= 0) {
                coords.latitude = geo[0];
                coords.longitude = geo[1];
            }
        }

        return coords;
    }

    private notifyParent(data: IItemData): void {
        this.setState({ data });
        this.props.onChange(data);
    }

    private getCurrentPosition(): Promise<any> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
        });
    }

    private async handleClick(event): Promise<void> {
        const { data } = this.state;

        try {
            const { coords } = await this.getCurrentPosition();
            this.setState({ latitude: coords.latitude, longitude: coords.longitude });

            data.value = coords.latitude + "@" + coords.longitude;
            this.notifyParent(data);
        } catch ({ message }) {
            alert(message);
        }

        // data.value = event.target.value;

        /* if (event.target.checkValidity()) {
            this.notifyParent(data);
        } */
    }

    public render(): React.ReactNode {
        if (this.state.data) {
            return <React.Fragment>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                <span title={ this.state.data.item.options.map(option => option.label + ": " + option.value).join(", ") }>{ this.state.data.item.label + (this.state.data.item.required ? " *" : "") }</span>
                                {
                                    (this.state.latitude && this.state.longitude)
                                        && 	<React.Fragment>
                                            &nbsp;<small>
                                                <a target="_blanck" href={ "http://maps.google.com/maps?q=" + this.state.latitude + "," + this.state.longitude } style={{ textDecoration: "none", color: "gray" }}>(ouvrir carte)</a>
                                            </small>
                                        </React.Fragment>
                                }
                            </th>
                            <td>
                                {
                                    this.state.data
                                        && <React.Fragment>
                                            <input
                                                type="button"
                                                ref={ this.inputRef }
                                                value="Activer la géolocalisation"
                                                disabled={ !this.props.new && (this.state.readonly || this.state.data.item.readonly) }
                                                onClick={ this.handleClick.bind(this) } />
                                        </React.Fragment>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>;
        }

        return null;
    }
}
