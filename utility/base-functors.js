
const {map, extract } = require('fantasy-land');

const getInstance = (self, constructor) =>
    (self instanceof constructor) ?
        self :
        Object.create(constructor.prototype) ;

// always maps
const Identity = function(x){
    const self = getInstance(this, Identity)
    self[map] = f => Identity(f(x))
    self[extract] = () => x

    return Object.freeze(self)
}



// never maps
const Const = function(x) {
    const self = getInstance(this, Const)

    self[map] = _ =>  Const(x)
    self[extract] = () => x

    return Object.freeze(self)
}

const extractFrom = x =>
    x[extract]()

const isEqualTo  = (a, b) =>
    extractFrom(a) === extractFrom(b)


module.exports =Object.freeze({
    Identity,
    Const,
    extractFrom,
    getInstance,
    isEqualTo
})