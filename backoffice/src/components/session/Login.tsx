import * as React from "react";

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
        return <React.Fragment>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <input type="text" placeholder="nfeid" value={ this.state.nfeid } onChange={ this.handleChangeNfeid.bind(this) } />
                        </td>
                        <td rowSpan={ 2 }>
                            <input type="button" value="Submit" onClick={ this.handleClick.bind(this) } />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="password" placeholder="password" value={ this.state.password } onChange={ this.handleChangePassword.bind(this) } />
                        </td>
                    </tr>
                </tbody>
            </table>
        </React.Fragment>;
    };
}
