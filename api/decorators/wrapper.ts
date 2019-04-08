import * as Q from "q";

export function makecoffee(target, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const method = descriptor.value;

    descriptor.value = function() {
        return Q.async(method).apply(this, arguments);
    };

    return descriptor;
}

export function unicornStuff(target, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const method = descriptor.value;

    descriptor.value = function() {
        return Q.async(function(request, response, next) {
            Q.spawn(function *() {
                yield Q.async(method).call(this, request, response, next).catch(next);
            });
        }).apply(this, arguments);
    };

    return descriptor;
}
