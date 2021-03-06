const {NotFound, Solution, SearchLimitExhausted} = require("../../../../utility/search-result-functor")
const {Queue} = require("../../../../abstract-data-types/queue.js")
const {SearchNode, getChild} = require("../../../problem-definition")

const trackExpansion = (problem, frontier) => {
    return false
    problem.expansion.push(frontier.slice(0))
}

const dfs = (problem, limit = 3) => {
    const initialNode = SearchNode(problem.initialState, 0)
    return dfs_recursive(problem, limit, initialNode)
}

const dfs_recursive = (problem, limit, node) => {
    if (problem.meetsGoal(node.state)) {
        node.expansion = problem.expansion
        return Solution(node)
    }
    if (limit == 0) return SearchLimitExhausted()

    // need to reverse the actions so they behave like stack
    // as opposed to a queue
    const actions = problem.actions(node.state).reverse()

    // not used for solution, but good for understanding
    trackExpansion(problem, actions.map(f => f().nextNode))

    let isSearchLimit = false
    for (const action of actions) {
        // get child based on action on current node
        const child = getChild(problem, node, action)

        if (node.notVisited(child)) {

            const result = dfs_recursive(problem, limit - 1, child)

            if (result instanceof Solution) {
                return result
            }
            if (result instanceof SearchLimitExhausted) isSearchLimit = true
        }

    }
    if (isSearchLimit) {
        return SearchLimitExhausted()
    } else {
        return NotFound()
    }
}

const dfs_deepening = (problem, limit = 10) => {
    for (let i = 1; i <= limit; i++) {
        console.log((new Date()).toISOString(), "depth limit: ", i)
        const r = dfs(problem, i)
        if (r instanceof Solution) {
            return r
        } else if (r instanceof NotFound) {
            return r
        }
    }

    return SearchLimitExhausted()
}


module.exports = {
    dfs, dfs_deepening
}