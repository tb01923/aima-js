const {Pair} = require("../abstract-data-types/pair")

const getInstance = (self, constructor) =>
    (self instanceof constructor) ?
        self :
        Object.create(constructor.prototype) ;

const K = x => () => x

const Problem = function(states, goalTest, initialState, actions, stepCosts, heuristic=K(0)) {
    const self = getInstance(this, Problem)

    self.goalTest = goalTest
    self.initialState = initialState
    self.actions = actions
    self.stepCosts = stepCosts
    self.heuristic = heuristic

    self.getInitialSearchNode = () => SearchNode(self, initialState, 0)
    self.getActionsForState = (state) => K(self.actions(state) || [])

    return self
}

const Step = function(from, label, to) {
    const self = getInstance(this, Step)
    self.fst = label
    self.snd = from

    return self
}

const SearchNode = function(problem, state, g, h, steps=[]) {
    const self = getInstance(this, SearchNode)

    self.state = state
    self.g = g
    self.h = h
    self.steps = steps

    self.meetsGoal = K(problem.goalTest(self.state))

    self.addStep = step => {
        self.steps = self.steps.concat([step])
        return self
    }

    self.getActions = problem && problem.getActionsForState(self.state)

    self.takeAction = action => {
        const {name, nextState, cost} = action()

        const childNode = SearchNode(
            problem,
            nextState,
            self.g + cost,
            problem.heuristic(nextState.value) ,
            self.steps
        )
''
        childNode.addStep(Step(self, `${name}[cost: ${cost}, est-remain ${childNode.h ? "~" + childNode.h : ""}]`, childNode))
        return childNode
    }

    self.notVisited = (searchNode) => {
        return null == self.steps.find(({fst, snd}) => searchNode.state.id == snd.state.id)
    }

    return self
}

module.exports = {
    Problem
}