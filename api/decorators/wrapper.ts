import * as Q from "q";

export function makecoffee(target, property: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const method = descriptor.value;

    descriptor.value = function() {
        return Q.async(method).apply(this, arguments);
    };

    return descriptor;
}
