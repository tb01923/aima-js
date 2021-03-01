const getInstance = (self, constructor) =>
    (self instanceof constructor) ?
        self :
        Object.create(constructor.prototype) ;

function PriorityQueue() {
    self = getInstance(this, PriorityQueue)
    self.elements = [];
    self.enqueue = function (e) {
        const insertPoint = self.elements.findIndex(q => q.cost > e.cost)
        if(insertPoint == -1) {
            self.elements.push(e);
        } else {
            self.elements.splice(insertPoint, 0, e);
        }
    };
    self.dequeue = function () {
        return this.elements.shift();
    };
    self.isEmpty = function () {
        return this.elements.length == 0;
    };
    self.contains = function(node) {
        return self.elements.find(queued => queued.state == node.state) != null
    }
    self.getItem = function (node) {
        const idx = self.elements.findIndex(queued => queued.state == node.state)
        const item = self.elements[idx]

        return {idx, item}
    }

    self.replace = function (idx, node) {
        self.elements[idx] = node
    }


    return self
}

module.exports = {PriorityQueue}