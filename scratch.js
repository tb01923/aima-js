const sortBy1stPosition = ([a], [b]) => (a < b) ? -1 : 1

const appendOperation = ({result, selectionStart, selectionEnd}, [_, __, string]) => {

    return {
        result: result + string,                                // append string to result
        selectionStart,                                         // noop
        selectionEnd                                            // noop
    }
}

const selectOperation = ({result, selectionStart, selectionEnd}, [_, __, start, end]) => {
    return {
        result,                                                 // noop
        selectionStart: start,                                  // mark selection start
        selectionEnd: end                                       // mark selection end
    }
}

const boldOperation =  ({result, selectionStart, selectionEnd}, _) => {
    return {
        result:
            result.substring(0, selectionStart) +               // up to start
            "*" +                                               // bold marker
            result.substring(selectionStart, selectionEnd) +    // the selected part
            "*" +                                               // bold marker
            result.substring(selectionEnd),                     // selection to end
        selectionStart,
        selectionEnd}
}

// duplicate has a bad description, example indicates it duplicates in place as opposed to end
const duplicateOperation =  ({result, selectionStart, selectionEnd}, _) => {
    return {
        result:
            result.substring(0, selectionStart) +               // up to start
            result.substring(selectionStart, selectionEnd) +    // selection once
            result.substring(selectionStart, selectionEnd) +    // selection twice
            result.substring(selectionEnd),                     // selection to end
        selectionStart,
        selectionEnd}
}


// operation dictionary (better than switch statement, or if else)
const operations = {
    APPEND: appendOperation,
    SELECT: selectOperation,
    BOLD: boldOperation,
    DUPLICATE: duplicateOperation
}

const reducer = (agg, [_, operation, ...xs]) => {
    // get operation from dictionary
    const myOperation = operations[operation]

    return (myOperation) ?
        // if the operation is found apply it to the aggregate
        myOperation(agg, [_, operation, ...xs]) :
        // otherwise return aggregate
        agg
}


// main function
const run = queryArr =>
    queryArr
        .sort(sortBy1stPosition)                                    // sort by array position 0
        .reduce(                                                    // for each operation
            reducer,                                                    // decide which function to apply and apply
            {"result": "", selectionStart: -1, selectionEnd: -1})   // initial value of the aggregate
        ["result"]                                                  // extract result field from aggregate

const queries = [
    [0, "APPEND", "HELLO"],
    [0.1, "SELECT", 1, 4],
    [0.2, "DUPLICATE"],
    // [1, "APPEND", " world"],
    // [2, "SELECT", 1, 3],
    // [3, "BOLD"],
    [4, "APPEND", "!"],
]


console.log(run(queries))