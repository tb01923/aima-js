const { Identity, Const } = require('./base-functors.js')
const {map, extract } = require('fantasy-land');

///////////////////////////////////////////////////////////////////////////////////////////
// type Maybe =
//          Nothing |
//          Just x
///////////////////////////////////////////////////////////////////////////////////////////
const Maybe = function(){
    throw "Not Instanitable" ;
}
Maybe.fromNullable = x => x === null ? nothing : Just(x)
Maybe.fromUndefined = x => typeof x === 'undefined' ? nothing : Just(x)
Maybe.fromNillable = x => (x === null || typeof x === 'undefined') ? nothing : Just(x)

const Just = Identity
Just.prototype.isJust = true
Just.prototype.isNothing = false

const _Nothing = Const
_Nothing.prototype.isJust = false
_Nothing.prototype.isNothing = true

const unit = Object.freeze(new (function(){}))
const Nothing = () => _Nothing(unit)
const nothing = _Nothing(unit)

module.exports = {
    Maybe,
    Just,
    Nothing,
    nothing
}