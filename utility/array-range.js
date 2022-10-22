//https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
function range(start, end) {
    var foo = [];
    for (var i = start; i <= end; i++) {
        foo.push(i);
    }
    return foo;
}

module.exports = {range}