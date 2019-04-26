import * as jwt from "jsonwebtoken";

import SECRET_TOKEN from "../token";
import * as Model from "../entities/Token";
import { Random, Token } from "../utils/Random";
import { Crypto, Format } from "../utils/Utils";

export class PasswordCredential {
    constructor(public readonly algorithm: string = "sha512", public readonly keylen: number = 64, public readonly iterations: number = 100000) {
    }
    
    public store(password: string, salt: string): string {
        return Crypto.createPbkdf2(password, salt, this.algorithm, this.keylen, this.iterations);
    }

    static verify(password: string, salt: string, hash: string): boolean {
        return new PasswordCredential().store(password, salt) === hash;
    }

    static getGeneratedSalt(): string {
        return Random.roll(32, Token.x).next().value;
    }
};

export type TokenCredentialError = jwt.TokenExpiredError | jwt.JsonWebTokenError | jwt.NotBeforeError;

export class TokenCredential {
    public store(data: Model.Token, value: number = -1, unit: Format.Time = Format.Time.second): string {
        if (value < 0) {
            return jwt.sign(data, SECRET_TOKEN);
        }

        return jwt.sign(data, SECRET_TOKEN, { expiresIn: value + unit }); // https://github.com/zeit/ms
    }

    public get(token: string): Model.Token {
        return jwt.verify(token, SECRET_TOKEN) as Model.Token;
    }

    public verify(token: string, mtoken: Model.Token): boolean {
        const t: Model.Token = this.get(token);
        if (t.userId !== mtoken.userId
            || t.roleId !== mtoken.roleId) {
            return false;
        }

        return true;
    }
}
