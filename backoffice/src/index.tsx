import * as React from "react";
import { render } from "react-dom";
import * as Flex from "react-simple-flex-grid";
import { BrowserRouter, Switch, Route, match } from "react-router-dom";

import { Tracker } from "./Api";
import { TicketList } from "./components/ticket/TicketList";
import { TicketContent } from "./components/ticket/TicketContent";
import { ITracker } from "./models/ITracker";

// Home
class Index extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return <Flex.Row>
            <span>toto</span>
        </Flex.Row>;
    }
}

// Incidents
class Resource extends React.Component<{ trackers: Array<ITracker>, resource: string }, Object> {
    public render(): React.ReactNode {
        const tracker: ITracker = this.props.trackers.find(tracker => tracker.shortname == this.props.resource);

        if (tracker) {
            return <Flex.Row>
                <Flex.Col xs={ 12 } sm={ 9 }>
                    <TicketList address={ "/tickets/tracker/" + tracker.id } />
                </Flex.Col>
                <Flex.Col xs={ 0 } sm={ 3 }></Flex.Col>
            </Flex.Row>;
        }

        return null;
    }
}

// Ticket
class Ticket extends React.Component<{ match: match<{ id: string }> }, Object> {
    public render(): React.ReactNode {
        return <Flex.Row>
            <Flex.Col xs={ 12 } sm={ 7 }>
                <TicketContent ticketId={ parseInt(this.props.match.params.id, 10) } />
            </Flex.Col>
            <Flex.Col xs={ 0 } sm={ 5 }></Flex.Col>
        </Flex.Row>;
    }
}

// No Match
class NoMatch extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return <span>Lost...</span>;
    }
}

(async () => {
    const trackers: Array<ITracker> = await Tracker.find();

    render(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact render={ (props) => <Index { ...props } /> } />

                <Route path="/incidents" exact render={
                    (props) => 
                        <Resource { ...props } trackers={ trackers } resource="incident" /> 
                } />

                <Route path="/interventions" exact render={
                    (props) => 
                        <Resource { ...props } trackers={ trackers } resource="intervention" /> 
                } />

                <Route path="/sickness" exact render={
                    (props) => 
                        <Resource { ...props } trackers={ trackers } resource="sickness_leave" /> 
                } />

                <Route path="/paid" exact render={
                    (props) => 
                        <Resource { ...props } trackers={ trackers } resource="paid_leave" /> 
                } />

                <Route path="/tickets/:id([0-9]+)" component={ Ticket } />

                <Route component={ NoMatch } />
            </Switch>
        </BrowserRouter>,
        document.querySelector("#root") as Element
    );
})();
