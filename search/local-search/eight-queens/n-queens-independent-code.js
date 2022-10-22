const {makeCombinations} = require("../../../utility/array-combinations")
const {shuffle} = require("../../../utility/array-shuffle")
const {range} = require("../../../utility/array-range")

const randomN = n => Math.round(Math.random() * (n))

const placeNQueens = (n, onePerCol = true) => {
    const emptyRow = Array(n).fill(0)
    const randomCol = () => randomN(n - 1)

    const queenCols = (onePerCol) ?
        shuffle(range(0,n-1)) :
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
    const incrementer = (a, b) => a + 1
    // get row/col coordinates
    const coordinates = getQueenCoordinates(board)

    // build all combinations of coordinate pairs
    const combos = makeCombinations(2, coordinates)
    // convert each pair into a slope
    const slopes = combos.map(slope)


    const is = x => o => x == o
    const isEither = (x1, x2) => o => x1 == o || x2 == o


    // diagonal attacks happen when pairs have a slope of 1 | -1
    const cntDiag = slopes
        .map(Math.abs)
        .filter(is(1))
        .reduce(incrementer, 0)

    // vertical attacks happen when pairs have infinite slope
    const cntVert = slopes
        .filter(isEither(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY))
        .reduce(incrementer, 0)

    // horizontal attacks happen with 0 slope
    const cntHor = slopes
        .filter(is(0))
        .reduce(incrementer, 0)

    return cntDiag + cntHor + cntVert
}

const copyBoard = (m) => m.slice().map(row => row.slice())
const boardWithRow = (board, rowIdx) => (row) => {
    const altBoard = copyBoard(board)
    altBoard[rowIdx] = row
    return altBoard
}

const alternativeRows = row => {
    const queenAt = row.findIndex(c => c == 1)
    const moveQueen = to => {
        const copy = row.slice()
        copy[to] = 1
        copy[queenAt] = 0
        return copy
    }

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

const getNextBoardsWithHeuristic = board =>
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

    return sorted.filter(({h, board}) => h == bestScore)

}

const getBestAlternatives = board => {
    const alts = getNextBoardsWithHeuristic(board)
    const bestAlts = bestFromAlternatives(alts)
    return bestAlts
}


const printBoard = board => {
    board.forEach((row, rowIdx) => {
        console.log(row.join(" "))
    })
}

const PuzzleState = (partialState) => {
    return {
        id: getQueenCoordinates(partialState.board).join(";"),
        board: partialState.board,
        h: partialState.h || getAttacks(partialState.board)
    }
}

const n = 8
const board = PuzzleState({ board: placeNQueens(n) })

let bestState = board
let candidate = bestState

const seenBoards = []
const hasNotSeen = puzzleState => !seenBoards.find(priorState => puzzleState.id == priorState.id)

let tries = 0
while (candidate != null && candidate.h <= bestState.h && tries < 20) {
    seenBoards.push(candidate)
    bestState = candidate

    const bestAlternatives = getBestAlternatives(candidate.board)
        .map(PuzzleState)
        .filter(hasNotSeen)


    const bestAltRndIdx = randomN(bestAlternatives.length - 1)

    printBoard(candidate.board)
    console.log("--------------------------------")
    console.log("Total Attacks:", candidate.h, "; best alt attacks:",
        (bestAlternatives.length > 0) ? bestAlternatives[0].h: "no untried alternatives")
    console.log("--------------------------------\n")


    candidate = bestAlternatives[bestAltRndIdx]
    tries = tries + 1
}
console.log("================================")
console.log("Steps to solution:", tries)
console.log("================================")




