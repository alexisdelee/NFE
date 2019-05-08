import * as React from "react";
import { render } from "react-dom";

import { TicketList } from "./components/ticket/TicketList";

render(
    <TicketList address="/tickets/region/1" />,
    document.querySelector("#app") as Element
);
