const Maybe = function () {
}
Maybe.fromNullable = (x) => {
    if (x) return new Just(x)
    return new Nothing()
}

const Just = function (x) {
    return {
        map: (f) => {
            return new Just(f(x))
        },
        chain: (f) => {
            return f(x)
        },
        toString: () => {
            return `Just(${x})`
        }
    }
}

const Nothing = function () {
    return {
        map: (f) => {
            return new Nothing()
        },
        toString: () => {
            return `Nothing()`
        }
    }
}

const get = () => {
    // return Maybe.fromNullable(22)
    return Maybe.fromNullable(null)
}


const double = x => x * 2
console.log(
    get().map(double).map(double).toString()
)


const Either = function () {
}
Either.fromThrowable = (f) => {
    try {
        const x = f()
        return new Right(x)
    }
    catch (e) {
        return new Left(e)
    }
}

const Right = function (x) {
    return {
        map: (f) => {
            try {
                return new Right(f(x))
            } catch (e) {
                return new Left(e)
            }
        },
        toString: () => {
            return `Right(${x})`
        }
    }
}

const Left = function (e) {
    return {
        map: (f) => {
            return new Left(e)
        },
        toString: () => {
            return `Left(${e})`
        }
    }
}
// const Left = function (e) {
//     this.e = e
// }
// Left.prototype.map = (f) => {
//     return this
// }
//
// Left.prototype.toString = () => {
//     return `Left(${this.e})`
// }


const divide = (n, d) => {
    if (d === 0) throw "Cannot divide by zero"
    return n / d
}

const dataAccess = (conn, query) => Either.fromThrowable(() => divide(10, 2))

console.log(
    dataAccess()
        .map(double)
        .map((x) => divide(x, 0))
        .toString()
)

const propLens = k => o => {
    if(o[k] !== null) {
        return new Just(o[k])
    }
    return new Nothing()
}

const idxLens = i => arr => {
    if(arr[i] !== null) {
        return new Just(arr[i])
    }
    return new Nothing()
}

const first = idxLens(0)
const userLens = propLens("user")
const addressLens = propLens("address")
const streetLens = propLens("street")

const json = [{user: {address: {street: "easy"}}}]

console.log(
    first(json)
        .chain(userLens)
        .chain(addressLens)
        .chain(streetLens)
        .toString())

//user?.address?.street

// const stLens = propsLens(
//     ["user", "address", "street"])


























