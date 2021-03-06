import * as React from "react";
import { render } from "react-dom";
import * as Flex from "react-simple-flex-grid";
import { BrowserRouter, Switch, Route, match, Redirect } from "react-router-dom";

import { Permission, PermissionMethod } from "./Permission";

import { Login } from "./components/session/Login";
import { Header } from "./components/external/Header";
import { Menu } from "./components/external/Menu";
import { TicketList } from "./components/ticket/TicketList";
import { TicketContent } from "./components/ticket/TicketContent";
import { HistoryList } from "./components/history/HistoryList";
import { Statistic } from "./components/external/Statistic";

import "./Index.scss";


class Session extends React.Component<Object, Object> {
    public static mustBeLogged(node: React.ReactNode): React.ReactNode {
        if (!window.sessionStorage.getItem("x-access-token")) {
            return <Redirect to="/login" />
        }

        return node;
    }

    public static alreadyLogged(node: React.ReactNode): React.ReactNode {
        if (window.sessionStorage.getItem("x-access-token")) {
            return <Redirect to="/" />;
        }

        return node;
    }
}

// Home
class Index extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return Session.mustBeLogged(
            Permission.parseFromStorage().has("trackers", PermissionMethod.READ)
                && <Menu />
                || <Redirect to="/404" />
        );
    }
}

// All tickets
class AllTickets extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return Session.mustBeLogged(
            Permission.parseFromStorage().has("tickets", PermissionMethod.READ)
                && <Flex.Row>
                    <Flex.Col xs={ 0 } md={ 1 }></Flex.Col>
                    <Flex.Col xs={ 12 } md={ 10 }>
                        <TicketList 
                            address={ window.location.pathname + window.location.search }
                            readonly={ !Permission.parseFromStorage().has("tickets", PermissionMethod.CREATE) } />
                    </Flex.Col>
                    <Flex.Col xs={ 0 } md={ 1 }></Flex.Col>
                </Flex.Row>
                || <Redirect to="/404" />
        );
    }
}

// Ticket
class Ticket extends React.Component<{ match: match<{ id: string }> }, Object> {
    public render(): React.ReactNode {
        return Session.mustBeLogged(
            Permission.parseFromStorage().has("tickets", PermissionMethod.READ)
                && <Flex.Row>
                    <Flex.Col xs={ 12 }>
                        <TicketContent 
                            ticketId={ parseInt(this.props.match.params.id, 10) } 
                            readonly={ !Permission.parseFromStorage().has("tickets", PermissionMethod.UPDATE) } />
                    </Flex.Col>
                </Flex.Row>
                || <Redirect to="/404" />
        );
    }
}

// New ticket
class NewTicket extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return Session.mustBeLogged(
            Permission.parseFromStorage().has("tickets", PermissionMethod.CREATE)
                && <Flex.Row>
                    <Flex.Col xs={ 12 }>
                        <TicketContent new={ true } />
                    </Flex.Col>
                </Flex.Row>
                || <Redirect to="/404" />
        );
    }
}

// All histories for a specific ticket
class AllHistories extends React.Component<{ match: match<{ id: string }> }, Object> {
    public render(): React.ReactNode {
        return Session.mustBeLogged(
            Permission.parseFromStorage().has("histories", PermissionMethod.READ)
                && <Flex.Row>
                    <Flex.Col xs={ 0 } md={ 1 }></Flex.Col>
                    <Flex.Col xs={ 12 } md={ 10 }>
                        <HistoryList ticketId={ parseInt(this.props.match.params.id, 10) } />
                    </Flex.Col>
                    <Flex.Col xs={ 0 } md={ 1 }></Flex.Col>
                </Flex.Row>
                || <Redirect to="/404" />
        );
    }
}

// Statistics
class Statistics extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return Session.mustBeLogged(
            Permission.parseFromStorage().has("statistics", PermissionMethod.READ)
                && <Statistic />
                || <Redirect to="/404" />
        );
    }
}

// Authentication
class AuthenticationLogin extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return Session.alreadyLogged(<Login />);
    }
}

class AuthenticationLogout extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        window.sessionStorage.removeItem("x-access-token");

        return <Redirect to="/" />
    }
}

// 404
class NotFound extends React.Component<Object, Object> {
    public render(): React.ReactNode {
        return <section style={{ textAlign: "center" }}>
            <a href="/">
                <img src="/pipe_404.png" style={{ width: "240px" }} />
            </a>
        </section>;
        // return <a href="/">Revenir à la page d'accueil</a>;
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
        <Header />

        <section className="index-content">
            <Switch>            
                <Route path="/" exact render={ (props) => <Index { ...props } /> } />
                <Route path="/tickets" exact component={ AllTickets } />
                <Route path="/tickets/new" exact component={ NewTicket } />
                <Route path="/tickets/:id([0-9]+)/history" component={ AllHistories } />
                <Route path="/tickets/:id([0-9]+)" component={ Ticket } />

                <Route path="/statistics" exact component={ Statistics }></Route>

                <Route path="/login" component={ AuthenticationLogin } />
                <Route path="/logout" component={ AuthenticationLogout } />

                <Route path="/404" component={ NotFound } />
                <Route component={ NoMatch } />
            </Switch>
        </section>
    </BrowserRouter>,
    document.querySelector("#root") as Element
);
