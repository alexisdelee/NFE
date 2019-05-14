export enum FetchType {
    GET = "get",
    DELETE = "delete",
    POST = "post",
    PUT = "put"
};

export class FetchException extends Error {
    constructor(public code: number, message: string, public errors: Array<string> = []) {
        super(message);
    }
}

export class Fetch<T> {
    public accept: string = "application/json";
    public contentType: string = "application/json";
    public origin: string = "http://evil.com"; // trick

    constructor(public readonly address: string, public type: FetchType = FetchType.GET, public body: Object = new Object()) {
    }

    private prepareStatement(): Promise<Response> {
        const headers: Headers = new Headers({
            accept: this.accept,
            "content-type": this.contentType,
            origin: this.origin
        });

        if (this.type == FetchType.GET) {
            return fetch(this.address, {
                method: this.type,
                headers
            });
        } else {
            return fetch(this.address, {
                method: this.type,
                headers,
                body: JSON.stringify(this.body)
            });
        }
    }

    public async json(): Promise<T> {
        try {
            const response: Response = await this.prepareStatement();

            if (response.ok) {
                const { data } = await response.json();
                return Promise.resolve(<T>data);
            } else {
                const exception: FetchException = new FetchException(response.status, response.statusText);

                if (response.headers.get("content-type").includes("application/json")) { // error from server
                    const { errors } = await response.json();
                    exception.errors = errors;
                }

                throw exception;
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
