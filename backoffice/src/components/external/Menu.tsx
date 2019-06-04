import * as React from "react";
import * as Flex from "react-simple-flex-grid";

import { Tracker } from "../../Api";

import "./Menu.scss";
import { ITracker } from "../../models/ITracker";

// State
interface IMenuState {
    trackers: Array<ITracker>;
}

export class Menu extends React.Component<Object, IMenuState> {
    constructor(props: Object) {
        super(props);

        this.state = {
            trackers: new Array<ITracker>()
        };
    }

    public async componentDidMount(): Promise<void> {
        const trackers: Array<ITracker> = await Tracker.find();
        this.setState({ trackers });
    }

    private findTrackerByShortname(shortname: string): ITracker {
        return this.state.trackers.find(tracker => tracker.shortname == shortname);
    }

    public render(): React.ReactNode {
        if (this.state.trackers.length) {
            return <Flex.Row className="menu">
                <Flex.Col xs={ 0 } sm={ 3 }></Flex.Col>
                <Flex.Col xs={ 12 } sm={ 6 } className="tile">
                    <a href="/tickets">
                        <span>Tous les tickets</span>
                    </a>
                </Flex.Col>
                <Flex.Col xs={ 0 } sm={ 3 }></Flex.Col>

                <Flex.Col xs={ 0 } sm={ 3 }></Flex.Col>
                <Flex.Col xs={ 12 } sm={ 3 } className="tile">
                    <a href={ "/tickets/tracker/" + this.findTrackerByShortname("incident").id }>
                        <span>Incidents</span>
                    </a>
                </Flex.Col>
                <Flex.Col xs={ 12 } sm={ 3 } className="tile">
                    <a href={ "/tickets/tracker/" + this.findTrackerByShortname("intervention").id }>
                        <span>Interventions</span>
                    </a>
                </Flex.Col>
                <Flex.Col xs={ 0 } sm={ 3 }></Flex.Col>

                <Flex.Col xs={ 0 } sm={ 3 }></Flex.Col>
                <Flex.Col xs={ 12 } sm={ 3 } className="tile">
                    <a href="#">
                        <span>Agents</span>
                    </a>
                </Flex.Col>
                <Flex.Col xs={ 12 } sm={ 3 } className="tile">
                    <a href={ "/tickets/tracker/" 
                                + this.findTrackerByShortname("sickness_leave").id
                                + "," + this.findTrackerByShortname("paid_leave").id }>
                        <span>Congés</span>
                    </a>
                </Flex.Col>
                <Flex.Col xs={ 0 } sm={ 3 }></Flex.Col>
            </Flex.Row>;
        }

        return null;
    }
}
