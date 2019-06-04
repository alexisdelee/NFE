import * as React from "react";
import { render } from "react-dom";
import * as Flex from "react-simple-flex-grid";
import { BrowserRouter, Switch, Route, match, Redirect } from "react-router-dom";

import { Menu } from "./components/external/Menu";
import { TicketList } from "./components/ticket/TicketList";
import { TicketContent } from "./components/ticket/TicketContent";

// Home
class Index extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return <Menu />;
    }
}

// Incidents
class Resource extends React.Component<{ match: match<{ resource: string, ids: string }> }, Object> {
    public render(): React.ReactNode {
        if (["tracker"].includes(this.props.match.params.resource)) {
            return <Flex.Row>
                <Flex.Col xs={ 12 } sm={ 9 }>
                    <TicketList address={ "/tickets/" + this.props.match.params.resource + "/" + this.props.match.params.ids } />
                </Flex.Col>
                <Flex.Col xs={ 0 } sm={ 3 }></Flex.Col>
            </Flex.Row>;
        }

        return <Redirect to="/404" />;
    }
}

// All tickets
class AllTickets extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return <Flex.Row>
            <Flex.Col xs={ 12 } sm={ 6 }>
                <TicketList address="/tickets" />
            </Flex.Col>
        </Flex.Row>;
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

// 404
class NotFound extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return <span>Lost...</span>;
    }
}

// No Match
class NoMatch extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return <Redirect to="/404" />;
    }
}

render(
    <BrowserRouter>
        <Switch>
            <Route path="/" exact render={ (props) => <Index { ...props } /> } />
            <Route path="/tickets/:resource/:ids([0-9,]+)" component={ Resource } />
            <Route path="/tickets" exact component={ AllTickets } />
            <Route path="/tickets/:id([0-9]+)" component={ Ticket } />

            <Route path="/404" component={ NotFound } />
            <Route component={ NoMatch } />
        </Switch>
    </BrowserRouter>,
    document.querySelector("#root") as Element
);
