const {makeCombinations} = require("../../../utility/array-combinations")
const {shuffle} = require("../../../utility/array-shuffle")
const {range} = require("../../../utility/array-range")
const {matrixCopy} = require("../../../utility/matrix-copy")

const placeQueens = (n, onePerCol=true) => {
    const randomN = n => Math.round(Math.random() * (n))
    const emptyRow = Array(n).fill(0)
    const randomCol = () => randomN(n - 1)

    const queenCols = (onePerCol) ?
        shuffle(range(0, n-1)) :
        Array(n).fill(null).map((_) => randomCol())


    const placeQueen = i => {
        const row = emptyRow.slice()
        row[i] = 1
        return row
    }
    const board = (Array(n)).fill(null).map((_) => {
        const at = queenCols.pop()
        const row = placeQueen(at)
        return row
    })
    return board
}

const K = o => () => o

const isNotNull = x => x != null

const queenCoord = (row, col) => {
    return {row, col, toString: () => `${row}, ${col}`}
}

const getQueenCoordinates = board =>
    board.reduce((agg, row, rowIdx) => {
        const queensInRow = row.reduce((agg, col, colIdx) => {
            if (col == 1) {
                agg.push(queenCoord(rowIdx, colIdx))
            }
            return agg
        }, [])

        agg = agg.concat(queensInRow)
        return agg
    }, [])

const slope = ([coord1, coord2]) => {
    const rise = coord1.row - coord2.row
    const run = coord1.col - coord2.col
    return rise / run
}


const getAttacks = (board) => {
    const incrementer = (a, _) => a + 1
    const coordinates = getQueenCoordinates(board)

    const combos = makeCombinations(2, coordinates)
    const slopes = combos.map(slope)


    const is = x => o => x == o
    const isEither = (x1, x2) => o => x1 == o || x2 == o


    const cntDiag = slopes
        .map(Math.abs)
        .filter(is(1))
        .reduce(incrementer, 0)

    const cntVert = slopes
        .filter(isEither(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY))
        .reduce(incrementer, 0)

    const cntHor = slopes
        .filter(is(0))
        .reduce(incrementer, 0)

    return cntDiag + cntHor + cntVert
}

const boardWithRow = (board, rowIdx) => (row) => {
    const altBoard = matrixCopy(board)
    altBoard[rowIdx] = row
    return altBoard
}

const alternativeRows = row => {
    // find where the queen is at
    const queenAt = row.findIndex(c => c == 1)

    // move queen to a new col
    const moveQueen = to => {
        const copy = row.slice()
        copy[to] = 1
        copy[queenAt] = 0
        return copy
    }

    // generate all alternative rows
    const alternatives = row
        .map((col, colIdx) => {
            if (colIdx != queenAt) {
                return moveQueen(colIdx)
            }
            return null
        })
        .filter(isNotNull)

    return alternatives

}

const getAlternateBoardsWithHeuristic = board =>
    board
    // each row has 7 alternatives (moving queen to any other spot)
        .map((row, rowIdx) => [rowIdx, alternativeRows(board[rowIdx])])
        // for each of these 8*7=56 alternative rows, generate a new board
        //    with board in its existing state but swapping out those alternative
        .map(([rowIdx, alternativeRows]) => alternativeRows.map(boardWithRow(board, rowIdx)))
        // flatten so we get an array of the 56 possible boards
        .flat()
        .map(board => {
            const h = getAttacks(board)
            return {h, board}
        })

const bestFromAlternatives = boards => {
    const sorted = boards
        .slice()
        .sort((a, b) => a.h - b.h)

    const bestScore = sorted[0].h

    return sorted
        .filter(({h, _}) => h == bestScore)
        .map(({_, board}) => K({nextState: board}))

}

const getBestAlternatives = board => {
    const alts = getAlternateBoardsWithHeuristic(board)
    const bestAlts = bestFromAlternatives(alts)
    return bestAlts
}


const {ClosestSolution, Solution, SearchLimitExhausted} = require("../../../utility/search-result-functor")
const hillClimbingSeach = require("../hill-climbing-search")
const {Problem} = require('../../problem-definition');
const {map, extract} = require('fantasy-land');

const hasNoAttacks = (board) => getAttacks(board) == 0

const n = 8
const problem = Problem(
    null,                   // unused in all?
    hasNoAttacks,           // no goal test with hill climbing, but why not when we have a goal e.g. n-queens
    placeQueens(n),         // initial state
    getBestAlternatives,    // subsequent states
    null,                   // step cost
    getAttacks              // heuristic
)

const printBoard =  (label, board) => {
    console.log(label)
    console.log("--------------------------------\n")

    board.forEach((row, rowIdx) => {
        console.log(row.join(" "))
    })
}

const printResult = (label, result) => {
    console.log()
    console.log(label)
    console.log("--------------------------------\n")

    result.state.forEach((row, rowIdx) => {
        console.log(row.join(" "))
    })

    console.log("--------------------------------")
    console.log("Total Attacks:", result.h,)
    console.log("--------------------------------\n")
}

const x = hillClimbingSeach(hillClimbingSeach.DESCENT, problem, 30)

printBoard("Initial", problem.initialState)
if (x instanceof Solution) {
    printResult("solution", x[extract]())
} else if (x instanceof SearchLimitExhausted ) {
    printResult("attempt limit reached", (x[extract]()).best)
} else if (x instanceof ClosestSolution ) {
    printResult("local minima", x[extract]())
}