const {ClosestSolution, Solution, SearchLimitExhausted} = require("../../utility/search-result-functor")
const randomN = n => Math.round(Math.random() * (n))

const hillClimbingSeach = (direction, problem, limit = 10) => {
    let candidate = problem.getInitialSearchNode()
    candidate.h = problem.heuristic(candidate.state)

    let bestCandidate = candidate

    let tries = 0
    while (candidate && candidate.h <= bestCandidate.h && tries < limit) {

        if (candidate.meetsGoal()) {
            return Solution(candidate)
        }

        // track and limit sideways moves,
        // if they are not equal and there has been sideways moves -> reset
        if (candidate.h == bestCandidate.h) {
            tries = tries + 1
            console.log("sideways")
        } else if (tries > 0) {
            tries = 0
            console.log("new path")
        } else {
            console.log("on path")
        }

        // update candidates (best, current), and take
        //  next action (if there is more than 1, pick one at random)
        bestCandidate = candidate
        const actions = candidate.getActions();

        const action = actions[randomN(actions.length - 1)]
        candidate = candidate.takeAction(action)

    }

    if (tries == limit) {
        return SearchLimitExhausted(limit, candidate)
    } else {
        return ClosestSolution(candidate)
    }

}
hillClimbingSeach.ASCENT = "ascent"
hillClimbingSeach.DESCENT = "descent"


module.exports = hillClimbingSeach
