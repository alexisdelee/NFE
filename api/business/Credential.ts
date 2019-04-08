import { pbkdf2Sync } from "crypto";
import { sign, verify } from "jsonwebtoken";

import SECRET_TOKEN from "../token";
import { Random, Token } from "../utils/Random";

export class PasswordCredential {
    public static readonly iterations = 100;
    public static readonly algorithm  = "sha512";

    public static getGeneratedSalt(): string {
        return Random.roll(20, Token.x).next().value;
    }
    
    public store(password: string): string {
        return pbkdf2Sync(
            password,
            PasswordCredential.getGeneratedSalt(),
            PasswordCredential.iterations,
            64,
            PasswordCredential.algorithm
        ).toString("hex");
    }

    public verify(password: string, hash: string): boolean {
        return this.store(password) === hash;
    }
};

export class TokenCredential {
    public store(data: Object, unlimited: boolean = false): string {
        if (unlimited) {
            return sign(data, SECRET_TOKEN);
        }

        return sign(data, SECRET_TOKEN, { expiresIn: "1h" }); // expire after 1h
    }

    public get(token: string): Object {
        return verify(token, SECRET_TOKEN);
    }
}
