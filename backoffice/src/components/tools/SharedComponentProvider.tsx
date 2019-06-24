import * as React from "react";

import { ASharedComponent } from "./ASharedComponent";

export const SharedComponent = React.createContext<Array<Array<typeof ASharedComponent>>>([]);
