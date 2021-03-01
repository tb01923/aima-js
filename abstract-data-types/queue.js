const getInstance = (self, constructor) =>
    (self instanceof constructor) ?
        self :
        Object.create(constructor.prototype) ;

function Queue() {
    self = getInstance(this, Queue)
    self.elements = [];
    self.enqueue = function (e) {
        this.elements.push(e);
    };
    self.dequeue = function () {
        return this.elements.shift();
    };
    self.isEmpty = function () {
        return this.elements.length == 0;
    };
    self.contains = function(node) {
        const found = self.elements.find(queued => queued.state == node.state)
        return found != null
    }
    return self
}

module.exports = {Queue}