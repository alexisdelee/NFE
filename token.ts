/* import { randomBytes } from "crypto";

export default randomBytes(32).toString("hex"); */

import { Random, Token } from "./utils/Random";

export default Random.roll(64, Token.x).next().value;
