import * as React from "react";
import * as Flex from "react-simple-flex-grid";

import "./Header.scss";
import { Permission, PermissionMethod } from "../../Permission";

// State
interface IHeaderState {
    alive: boolean;
}

export class Header extends React.Component<Object, IHeaderState> {
    constructor(props: object) {
        super(props);

        this.state = {
            alive: false
        };
    }

    public componentDidMount(): void {
        this.setState({ alive: !!window.sessionStorage.getItem("x-access-token") && !(this.getParam("no-header") == "true") });
    }

    public getParam(key: string): string {
        return new URL(window.location.href).searchParams.get(key);
    }

    public render(): React.ReactNode {
        if (this.state.alive) {
            return <Flex.Row className="header">
                <Flex.Col xs={ 7 }>
                    <ul>
                        <li>
                            <a href="/" className={ window.location.pathname == "/" ? "active": "" }>Acccueil</a>
                        </li>
                        {
                            window.innerWidth > 1175
                                && <React.Fragment>
                                    <li>
                                        <a href="/tickets" className={ window.location.pathname == "/tickets" ? "active": "" }>Tous les tickets</a>
                                    </li>
                                    <li>
                                        <a href="/tickets?resource=tracker&resourceId=1">Incidents</a>
                                    </li>
                                    <li>
                                        <a href="/tickets?resource=tracker&resourceId=3">Interventions</a>
                                    </li>
                                    <li>
                                        <a href="/tickets?resource=tracker&resourceId=4,5">Congés</a>
                                    </li>
                                    {
                                        Permission.parseFromStorage().has("statistics", PermissionMethod.READ)
                                            && <li>
                                                <a href="/statistics" className={ window.location.pathname == "/statistics" ? "active": "" }>Statistiques</a>
                                            </li>
                                    }
                                </React.Fragment>
                        }
                    </ul>
                </Flex.Col>
                <Flex.Col xs={ 4 }>
                    <ul>
                        <li>
                            <a href="/logout">Déconnecter</a>
                        </li>
                    </ul>
                </Flex.Col>
            </Flex.Row>;
        }

        return null;
    }
}
