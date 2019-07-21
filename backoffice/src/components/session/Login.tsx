import * as React from "react";
import * as Flex from "react-simple-flex-grid";

import { Authentication, Tracker } from "../../Api";
import { IAuthentication } from "../../models/IAuthentication";

import "./Login.scss";

// State
interface ILoginState {
    nfeid: string;
    password: string;
}

export class Login extends React.Component<Object, ILoginState> {
    constructor(props: Object) {
        super(props);

        this.state = {
            nfeid: "",
            password: ""
        };
    }

    public handleChangeNfeid(event) {
        this.setState({ nfeid: event.target.value });
    }

    public handleChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    public async handleClick(event) {
        try {
            const response: IAuthentication = await Authentication.login(this.state.nfeid, this.state.password);
            window.sessionStorage.setItem("x-access-token", response.token);

            window.location.href = "/";
        } catch(err) {
            alert(err.error ? err.error : err.toString());
        }
    }

    public render(): React.ReactNode {
        return <Flex.Row className="login-content">
            <Flex.Col xs={ 0 } md={ 4 }></Flex.Col>
            <Flex.Col xs={ 12 } md={ 4 } className="login-content__body">
                <Flex.Row className="login-content_header">
                    <Flex.Col xs={ 2 } style={{ backgroundColor: "#027b798c" }}></Flex.Col>
                    <Flex.Col xs={ 3 } style={{ backgroundColor: "#df392da3" }}></Flex.Col>
                    <Flex.Col xs={ 2 } style={{ backgroundColor: "#fcba029c" }}></Flex.Col>
                    <Flex.Col xs={ 3 } style={{ backgroundColor: "#483d4199" }}></Flex.Col>
                    <Flex.Col xs={ 2 } style={{ backgroundColor: "#71c5e7a3" }}></Flex.Col>
                </Flex.Row>
                <Flex.Row className="login-content_title">
                    <Flex.Col xs={ 12 }>
                        <h1>Connexion au backoffice</h1>
                    </Flex.Col>
                </Flex.Row>
                <Flex.Row>
                    <Flex.Col xs={ 2 }></Flex.Col>
                    <Flex.Col xs={ 8 }>
                        <input type="text" placeholder="nfeid" value={ this.state.nfeid } onChange={ this.handleChangeNfeid.bind(this) } /><br />
                        <input type="password" placeholder="password" value={ this.state.password } onChange={ this.handleChangePassword.bind(this) } /><br />
                        <input type="button" value="Valider" onClick={ this.handleClick.bind(this) } />
                    </Flex.Col>
                    <Flex.Col xs={ 2 }></Flex.Col>
                </Flex.Row>
            </Flex.Col>
            <Flex.Col xs={ 0 } md={ 4 }></Flex.Col>
        </Flex.Row>;
    };
}
