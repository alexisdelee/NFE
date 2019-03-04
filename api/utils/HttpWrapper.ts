export class HttpWrapper {
    constructor(public code: number, public message: string, public why: string) {
    }
}

// 2xx

export class Succcess extends HttpWrapper {
    constructor(code: number, message: string, why: string) {
        super(code, message, why);
    }
}

export class Ok extends Succcess {
    constructor(message: string) {
        super(Ok.code, "ok: " + message, "requête traitée avec succès");
    }

    static get code(): number {
        return 200;
    }
}

export class Created extends Succcess {
    constructor(message: string) {
        super(Created.code, "created: " + message, "requête traitée avec succès et création d’un document");
    }

    static get code(): number {
        return 201;
    }
}

export class NoContent extends Succcess {
    constructor(message: string) {
        super(NoContent.code, "no content: " + message, "requête traitée avec succès mais pas d’information à renvoyer");
    }

    static get code(): number {
        return 204;
    }
}

// 4xx

export class ClientError extends HttpWrapper {
    constructor(code: number, message: string, why: string) {
        super(code, message, why);
    }
}

export class BadRequest extends ClientError {
    constructor(message: string) {
        super(BadRequest.code, "bad request: " + message, "la syntaxe de la requête est erronée");
    }

    static get code(): number {
        return 400;
    }
}

export class Unauthorized extends ClientError {
    constructor(message: string) {
        super(Unauthorized.code, "unauthorized: " + message, "une authentification est nécessaire pour accéder à la ressource");
    }

    static get code(): number {
        return 401;
    }
}

export class Forbidden extends ClientError {
    constructor(message: string) {
        super(Forbidden.code, "forbidden: " + message, "l'authentification a été acceptée mais les droits d'accès ne permettent pas au client d'accéder à la ressource");
    }

    static get code(): number {
        return 403;
    }
}

export class NotFound extends ClientError {
    constructor(message: string) {
        super(NotFound.code, "not found: " + message, "ressource non trouvée");
    }

    static get code(): number {
        return 404;
    }
}

export class MethodNotAllowed extends ClientError {
    constructor(message: string) {
        super(MethodNotAllowed.code, "method not allowed: " + message, "méthode de requête non autorisée");
    }

    static get code(): number {
        return 405;
    }
}

export class NotAcceptable extends ClientError {
    constructor(message: string) {
        super(NotAcceptable.code, "not acceptable: " + message, "la ressource demandée n'est pas disponible dans un format qui respecterait les en-têtes \"Accept\" de la requête");
    }

    static get code(): number {
        return 406;
    }
}

export class Conflict extends ClientError {
    constructor(message: string) {
        super(Conflict.code, "conflict: " + message, "la requête ne peut être traitée en l’état actuel");
    }

    static get code(): number {
        return 409;
    }
}

// 5xx

export class ServerError extends HttpWrapper {
    constructor(code: number, message: string, why: string) {
        super(code, message, why);
    }
}

export class InternalServerError extends ServerError {
    constructor(message: string) {
        super(InternalServerError.code, "internal server error: " + message, "erreur interne du serveur");
    }

    static get code(): number {
        return 500;
    }
}

export class NotImplemented extends ServerError {
    constructor(message: string) {
        super(NotImplemented.code, "not implemented: " + message, "fonctionnalité réclamée non supportée par le serveur");
    }

    static get code(): number {
        return 501;
    }
}

export class ServiceUnavailable extends ServerError {
    constructor(message: string) {
        super(ServiceUnavailable.code, "service unavailable: " + message, "service temporairement indisponible ou en maintenance");
    }

    static get code(): number {
        return 503;
    }
}

export class UnknownError extends ServerError {
    constructor(message: string) {
        super(UnknownError.code, "unknown error: " + message, "réponse générique lorsque le serveur d'origine retourne un résultat imprévu");
    }

    static get code(): number {
        return 520;
    }
}
