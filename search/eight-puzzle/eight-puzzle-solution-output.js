const {map, extract} = require('fantasy-land');
const arrayToMatrix = require('../../utility/array-to-matrix')

const makeBoard = board => {
    board = arrayToMatrix(board, 3)

    const makeRow = row => row.map(col => {
        let val = "  "
        if (col != null) {
            val = " " + col
        }
        val += " |"
        return val
    }).join("")

    const boundary = "-------------\n"
    const rowSeparator = "|---|---|---|\n"
    const rows = board.map(row => "|" + makeRow(row) + "\n")

    const boardLayout = boundary + rows[0] + rowSeparator + rows[1] + rowSeparator + rows[2] + boundary
    return boardLayout
}

const printSolution = (solution) => {
    return solution[map](
        boardState => {
            boardState.steps.map(({fst, snd}) => {
                console.log(makeBoard(snd.state.value))
                console.log(`Step: ${fst}`)
            })
            console.log(makeBoard(boardState.state.value))
        }
        //"" + search.cost + " [" + search.steps.map(fst).join(", ") + "]\n" + ""
        //search.expansion.map(level => "\n\t" + level.map(node => node.id || node.state.id))
    )[extract]()

}

module.exports = printSolution
