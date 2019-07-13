export enum FetchType {
    GET = "get",
    DELETE = "delete",
    POST = "post",
    PUT = "put",
    PATCH = "patch"
};

export class FetchException extends Error {
    constructor(public code: number, message: string, public error: string = null) {
        super(message);
    }
}

export class Fetch<T> {
    constructor(public readonly address: string, public type: FetchType = FetchType.GET, public body: Object = new Object()) {
    }

    private prepareStatement(): Promise<Response> {
        const url: URL = new URL(this.address); // ugly trick to avoid error with CORS
        url.searchParams.append("x-access-token", window.sessionStorage.getItem("x-access-token"));

        if ([FetchType.GET, FetchType.DELETE].includes(this.type)) {
            return fetch(url.href, {
                method: this.type
            });
        } else {
            return fetch(url.href, {
                method: this.type,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.body)
            });
        }
    }

    public async json(): Promise<T> {
        try {
            const response: Response = await this.prepareStatement();

            if (response.ok) {
                const data = await response.json();
                return Promise.resolve(<T>data);
            } else {
                const exception: FetchException = new FetchException(response.status, response.statusText);

                if (response.status == 401) {
                    if (window.location.pathname != "/login") {
                        window.location.href = "/logout";
                    }
                }

                try {
                    let error = await response.json();
                    if (error && error.error) {
                        error = error.error;
                    }
                    exception.error = error;
                } catch(err) {
                    exception.error = err;
                } finally {
                    throw exception;
                }
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }
}
