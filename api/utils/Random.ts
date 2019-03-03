export enum Token {
    V = "AEIOUY",
    C = "BCDFGHJKLMNPQRSTVWXZ",
    v = "aeiouy",
    c = "bcdfghjklmnpqrstvwxz",
    A = "AEIOUYBCDFGHJKLMNPQRSTVWXZ",
    a = "AEIOUYaeiouyBCDFGHJKLMNPQRSTVWXZbcdfghjklmnpqrstvwxz",
    n = "0123456789",
    s = "@&?,=[]_:-+*\$#!\'^~;()/.",
    x = "AEIOUYaeiouyBCDFGHJKLMNPQRSTVWXZbcdfghjklmnpqrstvwxz0123456789@&?,=[]_:-+*\$#!\'^~;()/."
}

export enum Alias {
    l = Token.v + Token.c, // lowercase
    u = Token.V + Token.C  // uppercase
}

export class Random {
    public static *pull(...args: Array<Token | Alias>): IterableIterator<string> {
        const tokens: string = args.join("");
        while (true) {
            yield tokens[Math.floor(Math.random() * Math.floor((<string>tokens).length))];
        }
    }

    public static *roll(max: number, ...args: Array<Token | Alias>): IterableIterator<string> {
        while(true) {
            yield (<Array<string>>Array.from({ length: max }, () => "")).reduce(function(acc: Array<string>, item: string, index: number): Array<string> {
                acc[index] = Random.pull(...args).next().value;

                return acc;
            }, new Array<string>()).join("");
        }
    }
}
