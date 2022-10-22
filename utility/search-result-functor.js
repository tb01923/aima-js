const { Identity, Const } = require('./base-functors.js')
const {map, extract } = require('fantasy-land');

const getInstance = (self, constructor) =>
    (self instanceof constructor) ?
        self :
        Object.create(constructor.prototype) ;

/*
 * SearchResult =
 *     Solution x
 *     | NotFound
 *     | SearchLimitExhausted
 */
const SearchResult = function(){
    throw "Not Instanitable" ;
}

// identity functor
const Solution = function(x){
    const self = getInstance(this, Solution)
    self.x = x
    self[map] = f => Solution(f(self.x))
    self[extract] = () => self.x

    return Object.freeze(self)
}

// const functor to null
const NotFound = function() {
    const self = getInstance(this, NotFound)
    return Object.freeze(self)
}
NotFound.prototype[map] = f => NotFound()
NotFound.prototype[extract] = () => null

const SearchLimitExhausted =  function(limit, best) {
    const self = getInstance(this, SearchLimitExhausted)
    self[map] = f => SearchLimitExhausted(limit, best)
    self[extract] = () => {return {limit, best} }
    return Object.freeze(self)
}

const ClosestSolution = function(x){
    const self = getInstance(this, ClosestSolution)
    self.x = x
    self[map] = f => ClosestSolution(f(self.x))
    self[extract] = () => self.x

    return Object.freeze(self)
}


module.exports = {
    SearchResult,
    NotFound,
    Solution,
    SearchLimitExhausted,
    ClosestSolution
}