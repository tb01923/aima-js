const getInstance = (self, constructor) =>
(self instanceof constructor) ?
    self :
    Object.create(constructor.prototype) ;


const Pair = function (fst, snd) {
    const self = getInstance(this, Pair)
    self.fst = fst
    self.snd = snd

    self.toString = function() {
        return `Pair(${self.fst},${self.snd})`
    }

    return self
}

module.exports = { Pair }
