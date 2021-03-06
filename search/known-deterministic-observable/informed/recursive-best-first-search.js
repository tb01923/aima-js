const {extract} = require('fantasy-land');
const {NotFound, SearchLimitExhausted, Solution} = require("../../../utility/search-result-functor")

const rbfs = (problem) => {
    const initialSearchNode = problem.getInitialSearchNode()
    initialSearchNode.f = initialSearchNode.g + problem.heuristic(initialSearchNode.state.value)

    return rbfs_recursive(problem, Number.POSITIVE_INFINITY, initialSearchNode)
}


const max = (a, b) => (a > b) ? a : b
const min = (a, b) => (a < b) ? a : b

const getSuccessors = (problem, searchNode) => {
    const successors = []

    for (const action of searchNode.getActions()) {
        successors.push(searchNode.takeAction(action))
    }
    return successors
}

const indexOfSmallest = (a, notThisNOde) => {
    return a.reduce(function (lowest, next, index) {
        if (notThisNOde && next.state.id == notThisNOde.state.id) {
            return lowest
        }
        else if (lowest == null) {
            return index
        }
        else {
            return next.f < a[lowest].f ? index : lowest;
        }
    }, null);
}


const rbfs_recursive = (problem, fLimit, searchNode, move = "", level = 0) => {

    //console.log(JSON.stringify({level, id: searchNode.state.id, fLimit, thisF: searchNode.f, move}))

    if (searchNode.meetsGoal()) {
        return Solution(searchNode)
    }

    const successors = getSuccessors(problem, searchNode)
        .map(successor => {
            successor.f = max(successor.g + successor.h, searchNode.f)
            return successor
        })

    if (successors.length == 0) {
        return SearchLimitExhausted(Number.POSITIVE_INFINITY)
    }

    while (true) {
        const best = successors[indexOfSmallest(successors)]
        const alternative = successors[indexOfSmallest(successors, best)] || {"f": Number.POSITIVE_INFINITY}

        if (best.f > fLimit) {
            return SearchLimitExhausted(best.f)
        }

        //const alternative = successors[0] || {"f": Number.POSITIVE_INFINITY}
        const newLimit = min(fLimit, alternative.f)
        const result = rbfs_recursive(problem, newLimit, best, best.steps[best.steps.length - 1].fst, level + 1)

        if (result instanceof Solution) {
            return result
        } else if (result instanceof SearchLimitExhausted) {
            best.f = result[extract]()
        }

        const ten = 10
    }
}


module.exports = {rbfs}