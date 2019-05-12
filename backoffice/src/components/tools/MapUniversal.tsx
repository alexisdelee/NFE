import * as React from "react";

const { compose, withProps } = require("recompose");

import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/withScriptjs";
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer";

import { StatusItemUniversal } from "./StatusItemUniversal";

// import "./MapUniversal.scss";

// Props
interface IMapUniversalProps {
    zoom: number;
    latitude: number;
    longitude: number;
}

// State
interface IMapUniversalState {
    zoom: number;
    latitude: number;
    longitude: number;
}

const CustomMap = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBuPRwkSwkeMGwvGdy8Jz35JWkngHL2izc&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap,
)(props => {
    return <GoogleMap
        defaultZoom={ props.zoom }
        defaultCenter={{ lat: props.position.latitude, lng: props.position.longitude }}
        defaultOptions={{ mapTypeControl: false, streetViewControl: false }}>
        <MarkerClusterer
            averageCenter
            enableRetinaIcons
            gridSize={ 60 }>
            <Marker position={{ lat: props.position.latitude, lng: props.position.longitude }}></Marker>
        </MarkerClusterer>
    </GoogleMap>
});

export class MapUniversal extends React.Component<IMapUniversalProps, IMapUniversalState> {
    public static defaultProps = {
        zoom: 8
    };
    
    constructor(props: IMapUniversalProps) {
        super(props);

        this.state = {
            zoom: props.zoom,
            latitude: props.latitude,
            longitude: props.longitude
        };
    }

    public render(): React.ReactNode {
        return <CustomMap 
                    zoom={ this.state.zoom } 
                    position={{ latitude: this.state.latitude, longitude: this.state.longitude }} />
    }
}
