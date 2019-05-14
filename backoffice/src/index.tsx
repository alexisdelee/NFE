import * as React from "react";
import { render } from "react-dom";
import * as Flex from "react-simple-flex-grid";

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
