import * as React from "react";
import { render } from "react-dom";
import * as Flex from "react-simple-flex-grid";

import * as serviceWorker from "./serviceWorker";

import { TicketList } from "./components/ticket/TicketList";
import { TicketContent } from "./components/ticket/TicketContent";

render(
    <Flex.Row>
        <Flex.Col xs={ 12 } sm={ 9 }>
            <TicketList address="/tickets/region/1" />
        </Flex.Col>
        <Flex.Col xs={ 0 } sm={ 5 }></Flex.Col>
    </Flex.Row>,
    document.querySelector("#root") as Element
);

render(
    <Flex.Row>
        <Flex.Col xs={ 12 } sm={ 9 }>
            <TicketContent ticketId={ 1 } />
        </Flex.Col>
        <Flex.Col xs={ 0 } sm={ 5 }></Flex.Col>
    </Flex.Row>,
    document.querySelector("#ticket")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
