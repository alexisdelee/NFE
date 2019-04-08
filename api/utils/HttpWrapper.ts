// 2xx
export enum Success {
    // requête traitée avec succès
    Ok = 200,

    // requête traitée avec succès et création d’un document
    Created = 201,

    // requête traitée avec succès mais pas d’information à renvoyer
    NoContent = 204
}

// 4xx
export enum ClientError {
    // la syntaxe de la requête est erronée
    BadRequest = 400,

    // une authentification est nécessaire pour accéder à la ressource
    Unauthorized = 401,

    // l'authentification a été acceptée mais les droits d'accès ne permettent pas au client d'accéder à la ressource
    Forbidden = 403,

    // ressource non trouvée
    NotFound = 404,

    // méthode de requête non autorisée
    MethodNotAllowed = 405,

    // la ressource demandée n'est pas disponible dans un format qui respecterait les en-têtes "Accept" de la requête
    NotAcceptable = 406,

    // la requête ne peut être traitée en l’état actuel
    Conflict = 409
}

// 5xx
export enum ServerError {
    // erreur interne du serveur
    InternalServerError = 500,

    // fonctionnalité réclamée non supportée par le serveur
    NotImplemented = 501,

    // service temporairement indisponible ou en maintenance
    ServiceUnavailable = 503,

    // réponse générique lorsque le serveur d'origine retoure un résultat imprévu
    UnknownError = 520    
}

export class HttpError extends Error {
    constructor(public code: Success | ClientError | ServerError, message: string) {
        super(message);
    }
}
